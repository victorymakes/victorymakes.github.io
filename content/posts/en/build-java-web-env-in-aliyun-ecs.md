---
title: Building a Java Web Environment on Alibaba Cloud ECS
description: A step-by-step guide to purchasing an Alibaba Cloud ECS instance and setting up a complete Java Web environment with JDK, MySQL, Tomcat, and Elasticsearch.
date: 2017-06-17
tags:
  - id: "ecs"
    title: "ECS"
category:
  id: side-project
  title: Side Project
---

## Purchasing and Configuring an Alibaba Cloud ECS Instance

[Alibaba Cloud ECS](https://www.aliyun.com/product/ecs)

> Elastic Compute Service (ECS) is a scalable and high-performance cloud computing service that helps you quickly build secure and reliable applications while reducing operational costs and improving efficiency.

### Choosing an ECS Instance

From the product homepage, navigate directly to the purchase page and select an instance that fits your needs. The main options include:

- Billing method
- Region (choose an overseas region if you need unrestricted network access)
- Network (Classic Network vs VPC; Classic is simpler for personal use)
- Instance type (CPU, memory configuration)
- Bandwidth
- Image (operating system)
- Storage (default 40GB, expandable)
- Security settings (SSH login password)

<!-- more -->

### Network Configuration

After purchasing the ECS instance, you can view its details in the console. Pay attention to:

1. Public IP and private IP (you will SSH via the public IP)
2. Management options on the right panel

By default, accessing the server via public IP may fail:

```bash
telnet ip port
```

This happens because ECS security groups only open TCP ports **22** and **3389** by default, along with ICMP.

To allow access to web services, you must manually open ports **80**, **443**, or others such as **8080**.

Official guide:
[Allow Public Access via HTTP/HTTPS](https://help.aliyun.com/document_detail/25475.html)

---

## Setting Up the Java Web Environment

In this guide, we deploy the open-source e-commerce system **Shopizer** on the server.

> **Shopizer** is a web-based e-commerce and sales management CMS that supports shopping carts, inventory management, payments, shipping, order tracking, and invoices.

### System Environment

- OS: CentOS 7 (64-bit)
- Dependencies:
  - JDK
  - MySQL
  - Tomcat
  - Elasticsearch

---

## Installing JDK

The simplest way is to install OpenJDK via `yum`.

### Search for Java Packages

```bash
yum list java*
```

### Install JDK 8 (64-bit)

```bash
yum install java-1.8.0-openjdk.x86_64
```

### Verify Installation

```bash
java -version
```

### Locate Installation Directory

```bash
whereis java
```

---

## Installing and Starting MySQL

MySQL is not available directly via `yum` on CentOS 7, so we install it from the official repository.

### Download and Install MySQL RPM

```bash
wget https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm
rpm -ivh mysql57-community-release-el7-11.noarch.rpm
yum install mysql-community-server
```

### Start MySQL

```bash
systemctl start mysqld.service
```

### Retrieve Initial Root Password

```bash
cat /var/log/mysqld.log | grep "temporary password"
```

### Login and Reset Password

```bash
mysql -p
```

You must reset the password before executing any commands:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'yourpassword';
FLUSH PRIVILEGES;
```

---

## Installing and Running Tomcat

We download the latest Tomcat version manually to ensure compatibility.

```bash
wget http://apache.fayea.com/tomcat/tomcat-8/v8.5.15/bin/apache-tomcat-8.5.15.zip
yum install unzip
unzip apache-tomcat-8.5.15.zip
cd apache-tomcat-8.5.15/bin
./startup.sh
```

### Common Issue: Tomcat Stuck on Startup

If Tomcat hangs at:

> Deploying web application directory ...

You may need to disable auto-deployment or adjust configuration as described in this article:
[Tomcat Startup Stuck Issue](http://www.cnblogs.com/vinozly/p/5011138.html)

---

## Installing Elasticsearch

Shopizer uses Elasticsearch **2.x**, so we install version **2.4.4**.

### Download and Extract

```bash
wget https://download.elastic.co/elasticsearch/release/org/elasticsearch/distribution/zip/elasticsearch/2.4.4/elasticsearch-2.4.4.zip
unzip elasticsearch-2.4.4.zip
```

### Common Issues

#### 1. Cannot Run as Root

Elasticsearch refuses to run as root by default.

#### 2. Insufficient Memory

You may encounter memory allocation errors.

### Temporary Solution

```bash
./elasticsearch -Des.insecure.allow.root=true -Xms256m -Xmx256m
```

> ⚠️ **Note**: Running Elasticsearch as root is not recommended for production. Always deploy it as a dedicated user with proper memory allocation.

---

## Summary

With Alibaba Cloud ECS, you can quickly provision a server and deploy a full Java Web environment. This setup is suitable for personal projects, demos, and small-scale production systems.

Key takeaways:

- Always configure security group ports explicitly
- Use official repositories for critical components
- Avoid running services as root in production
- Monitor memory usage carefully on low-spec servers
