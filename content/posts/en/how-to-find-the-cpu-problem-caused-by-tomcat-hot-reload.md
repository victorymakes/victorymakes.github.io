---
title: Diagnosing CPU Spikes Caused by Tomcat Hot Deployment
description: A real-world troubleshooting guide to identifying and fixing abnormal CPU spikes caused by Tomcat hot reload behavior in production.
date: 2018-04-29
tags:
  - id: "java"
    title: "Java"
  - id: "tomcat"
    title: "Tomcat"
  - id: "cpu"
    title: "CPU"
category:
  id: program
  title: Program
---

## Problem Overview and Root Cause

**Web Server**: apache-tomcat-8.0.33  
**JDK**: JDK 1.8.0_66  
**Operating System**: Linux 2.6.32-642.6.2.el6.x86_64

The operations team reported abnormal CPU spikes on a production server.  
CPU usage would intermittently jump from nearly **0% to 50%**, as shown below.

The root cause was eventually traced to **Tomcat hot deployment (hot reload)**.

The issue was resolved by explicitly configuring:

```xml
reloadable="false"
```

> ⚠️ **Important note**  
> According to the official Tomcat documentation, hot deployment is **disabled by default**.  
> However, in this case, Tomcat still performed reload-related behavior even though `reloadable` was not explicitly enabled.

---

## Investigation Process

### 1. Identify the Service Process ID

```bash
ps aux | grep webAppName
```

---

### 2. Locate High-CPU Threads

```bash
top -H -p <pid>
```

---

### 3. Inspect Thread Stack Traces

```bash
jstack -F <pid> | grep <thread-id> -A 20
```

Example output:

```text
org.apache.catalina.loader.WebappClassLoaderBase.modified()
org.apache.catalina.loader.WebappLoader.modified()
org.apache.catalina.loader.WebappLoader.backgroundProcess()
org.apache.catalina.core.StandardContext.backgroundProcess()
```

This clearly indicates Tomcat-related background processing.

---

## Source Code Analysis

Call sequence:

```
WebappLoader.backgroundProcess()
  -> WebappLoader.modified()
```

Relevant source code from `WebappLoader.java`:

```java
private boolean reloadable = false;

@Override
public void backgroundProcess() {
    if (reloadable && modified()) {
        try {
            Thread.currentThread().setContextClassLoader(
                WebappLoader.class.getClassLoader()
            );
            if (context != null) {
                context.reload();
            }
        } finally {
            if (context != null && context.getLoader() != null) {
                Thread.currentThread().setContextClassLoader(
                    context.getLoader().getClassLoader()
                );
            }
        }
    }
}
```

This confirms that Tomcat was executing reload logic.

---

## Configuration Verification

The `server.xml` configuration showed no explicit hot reload settings:

```xml
<Host name="localhost" appBase="appBaseDir" unpackWARs="true" autoDeploy="false">
    <Context path="/app" docBase="app.war" unpackWAR="false"/>
</Host>
```

According to official documentation:

> Setting `reloadable=true` allows Tomcat to monitor class changes and reload applications automatically.  
> This feature is useful for development but **not recommended for production** due to significant overhead.

Despite the default being `false`, reload behavior was still observed.

---

## Final Fix

The issue was resolved by explicitly disabling reload behavior:

```xml
<Context path="/app"
         docBase="app.war"
         reloadable="false"/>
```

After applying this change, CPU usage returned to normal and remained stable.

---

## Key Takeaways

- Hot reload can introduce severe CPU overhead in production
- Never rely solely on default values—explicit configuration is safer
- Always disable reloadable features for production workloads
- Thread dump analysis is critical for diagnosing JVM performance issues

---

## Conclusion

This case highlights a subtle but dangerous pitfall in Tomcat deployments.  
Even default-disabled features can behave unexpectedly under certain conditions.

For production systems:

- Disable hot deployment explicitly
- Monitor background threads
- Validate configurations after upgrades

A small configuration change can prevent major production incidents.
