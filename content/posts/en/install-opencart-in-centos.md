---
title: Installing OpenCart on CentOS 7
description: A step-by-step guide to installing OpenCart 2.3 on CentOS 7, including LAMP setup, SEO configuration, and HTTPS support.
date: 2017-07-19
tags:
  - id: "opencart"
    title: "OpenCart"
  - id: "centos"
    title: "CentOS"
  - id: "php"
    title: "PHP"
category:
  id: side-project
  title: Side Project
---

## Environment

- CentOS 7.3 (64-bit)
- OpenCart 2.3.0.2

---

## Installing LAMP and OpenCart

Follow the official guide below to install the LAMP stack and OpenCart:

- [How To Install OpenCart on CentOS 7 Linux](http://www.unixmen.com/install-opencart-centos-7-linux/)

Once the basic installation is complete, additional configuration is required for **SEO-friendly URLs** and **HTTPS support**.

<!-- more -->

---

## Enabling SEO-Friendly URLs

To enable SEO URLs in OpenCart, you need to:

1. Enable SEO settings in the OpenCart admin panel
2. Create a `.htaccess` file in the OpenCart root directory

Rename `htaccess.txt` to `.htaccess`, or create a new `.htaccess` file with the following content:

```apache
# Enable URL alias support (requires mod_rewrite)
Options +FollowSymlinks

# Prevent directory listing
Options -Indexes

# Prevent direct access to sensitive files
<FilesMatch "(?i)((\.tpl|\.ini|\.log|(?<!robots)\.txt))">
  Require all denied
</FilesMatch>

# SEO URL settings
RewriteEngine On
RewriteBase /

# Force HTTPS
RewriteCond %{SERVER_PORT} !^443$
RewriteRule ^.*$ https://%{SERVER_NAME}%{REQUEST_URI} [L,R]

RewriteRule ^sitemap.xml$ index.php?route=extension/feed/google_sitemap [L]
RewriteRule ^googlebase.xml$ index.php?route=extension/feed/google_base [L]
RewriteRule ^system/download/(.*) index.php?route=error/not_found [L]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !.*\.(ico|gif|jpg|jpeg|png|js|css)
RewriteRule ^([^?]*) index.php?_route_=$1 [L,QSA]
```

---

## Enabling HTTPS Support

### Step 1: Install SSL Modules

```bash
yum install mod_ssl openssl
```

---

### Step 2: Obtain an SSL Certificate

You can use a free certificate (for example, from Alibaba Cloud or Let’s Encrypt).  
Upload the certificate files to your server.

---

### Step 3: Configure Apache SSL

Edit `/etc/httpd/conf.d/ssl.conf` and configure the certificate paths:

```apache
# Enable secure SSL protocols
SSLProtocol all -SSLv2 -SSLv3

# Configure cipher suites
SSLCipherSuite HIGH:!RC4:!MD5:!aNULL:!eNULL:!NULL:!DH:!EDH:!EXP:+MEDIUM
SSLHonorCipherOrder on

# Certificate files
SSLCertificateFile cert/public.pem
SSLCertificateKeyFile cert/yourdomain.key
SSLCertificateChainFile cert/chain.pem
```

---

### Step 4: Update OpenCart Configuration

Modify the following files:

#### `config.php`

```php
// HTTPS
define('HTTPS_SERVER', 'https://yourdomain/');
```

#### `admin/config.php`

```php
// HTTPS
define('HTTPS_SERVER', 'https://yourdomain/admin/');
define('HTTPS_CATALOG', 'https://yourdomain/');
```

---

### Step 5: Restart Apache

```bash
systemctl restart httpd
```

---

## Summary

With OpenCart installed on CentOS 7, and SEO and HTTPS properly configured, you now have a solid foundation for running an e-commerce website.

Key takeaways:

- Always enable SEO-friendly URLs for better search engine visibility
- Use HTTPS to protect user data and improve trust
- Verify Apache rewrite and SSL modules are correctly configured

This setup is suitable for small to medium-sized OpenCart deployments.
