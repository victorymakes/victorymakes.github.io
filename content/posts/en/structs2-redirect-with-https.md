---
title: Fixing Struts2 Redirect Issues Under HTTPS
description: How to resolve mixed-content errors caused by Struts2 redirects when applications are deployed behind HTTPS using Nginx.
date: 2016-11-20
tags:
  - id: "struts"
    title: "Struts"
category:
  id: program
  title: Program
---

## Problem Description

**Struts2 redirects only support HTTP by default**.
When an application is deployed behind HTTPS, this can cause browser errors such as:

> Mixed Content: The page at  
> `https://managertest.efun.com/userlogin.mainWindow.shtml`  
> was loaded over HTTPS, but requested an insecure script  
> `http://manager.efun.com/js/upload.js`.  
> This request has been blocked; the content must be served over HTTPS.

The relevant Struts2 configuration looked like this:

```xml
<action name="serviceManagerAction_*" class="serviceManagerAction" method="{1}">
    <result name="listPage">/serviceList.jsp</result>
    <result name="updateUI">/serviceList.jsp</result>
    <result name="update" type="redirect">
        serviceManagerAction_search.shtml?searchGame=${gid}&amp;beginTime=${beginTime}&amp;endTime=${endTime}&amp;area=${area}&amp;gameCode=${gameCode}
    </result>
    <result name="delete" type="redirect">
        serviceManagerAction_search.shtml?searchGame=${gid}&amp;beginTime=${beginTime}&amp;endTime=${endTime}&amp;area=${area}
    </result>
    <result name="save" type="redirect">
        serviceManagerAction_search.shtml?searchGame=${gid}&amp;beginTime=${beginTime}&amp;endTime=${endTime}&amp;area=${area}&amp;gameCode=${gameCode}
    </result>
</action>
```

<!-- more -->

---

## Initial Attempt: Struts2 SSL Plugin

The first idea was to use **struts2-ssl-plugin**:

- Documentation: https://code.google.com/archive/p/struts2-ssl-plugin/wikis/HowToUse.wiki

However, after deploying the plugin, the server entered an **infinite redirect loop**.
Logs repeatedly showed:

```
Going to SSL mode, redirecting to https://managertest.efun.com:443/userlogin.mainWindow.shtml
```

This approach failed.

---

## Root Cause Analysis

Further investigation revealed that:

- HTTPS termination was handled by **Nginx**
- Nginx redirected all incoming HTTP requests to HTTPS
- Struts2 redirects were still generating **HTTP URLs**

This mismatch caused the redirect loop and mixed-content errors.

---

## Final Solution: Rewrite Redirects in Nginx

Since HTTPS was enforced at the Nginx layer,
the solution was to **rewrite redirect URLs in Nginx responses**, converting HTTP redirects to HTTPS.

A helpful reference:

> How do I rewrite URLs in a proxy response in NGINX  
> https://stackoverflow.com/questions/32542282/how-do-i-rewrite-urls-in-a-proxy-response-in-nginx

By handling protocol rewriting at the proxy layer,
the application code remained unchanged while HTTPS compatibility was restored.

---

## Summary

Key lessons:

- Struts2 redirects default to HTTP
- SSL plugins may conflict with proxy-based HTTPS setups
- When HTTPS is terminated at Nginx, redirect rewriting should also be handled there

Understanding where HTTPS is enforced is critical to choosing the correct fix.
