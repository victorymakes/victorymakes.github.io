---
title: Running MySQL with Docker on CentOS
description: A step-by-step guide to installing Docker and Docker Compose on CentOS and running a MySQL 5.7 container with persistent data and configuration.
date: 2017-07-26
tags:
  - id: "docker"
    title: "Docker"
  - id: "mysql"
    title: "MySQL"
category:
  id: program
  title: Program
---

## Environment

- CentOS 7.3 (64-bit)

<!-- more -->

---

## Install Docker

### 1. Remove Old Versions

```bash
yum remove docker docker-common docker-selinux docker-engine
```

### 2. Set Up Docker Repository

#### 2.1 Install Required Packages

```bash
yum install -y yum-utils device-mapper-persistent-data lvm2
```

#### 2.2 Add Docker CE Stable Repository

```bash
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

### 3. Install Docker CE

#### 3.1 Update yum Cache

```bash
yum makecache fast
```

#### 3.2 Install Latest Docker CE

```bash
yum -y install docker-ce
```

#### 3.3 (Optional) Install a Specific Version

```bash
yum list docker-ce.x86_64 --showduplicates | sort -r
yum install docker-ce-<VERSION>
```

### 4. Start Docker

```bash
systemctl start docker
```

### 5. Verify Installation

```bash
docker -v
```

### 6. Uninstall Docker (Optional)

```bash
yum remove docker-ce
rm -rf /var/lib/docker
```

---

## Install Docker Compose

### 1. Download Docker Compose 1.14.0

```bash
curl -L https://github.com/docker/compose/releases/download/1.14.0/docker-compose-`uname -s`-`uname -m`   > /usr/local/bin/docker-compose
```

### 2. Make It Executable

```bash
chmod +x /usr/local/bin/docker-compose
```

### 3. Verify Version

```bash
docker-compose -v
```

---

## Run MySQL with Docker

### 1. Pull Official MySQL Image

```bash
docker pull mysql:5.7.18
```

### 2. Start MySQL Container

```bash
docker run --name mysql_db   -p 3306:3306   -v /home/docker/mysql/logs:/data/logs/mysql   -v /home/docker/mysql/data:/var/lib/mysql   -v /home/docker/mysql/conf/:/etc/mysql/conf.d   -e MYSQL_DATABASE=opencart   -e MYSQL_ROOT_PASSWORD=Ao@1234567890   -d mysql:5.7.18
```

#### Parameter Explanation

- `-p 3306:3306` – Port mapping
- `--name mysql_db` – Container name
- `-v /home/docker/mysql/data:/var/lib/mysql` – Persist MySQL data
- `-v /home/docker/mysql/conf/:/etc/mysql/conf.d` – Custom configuration
- `-v /home/docker/mysql/logs:/data/logs/mysql` – Persist logs
- `-e MYSQL_DATABASE=opencart` – Initialize database
- `-e MYSQL_ROOT_PASSWORD=...` – Set root password
- `-d` – Run in detached mode

Official image docs:
https://hub.docker.com/_/mysql/

---

## Sample `my.cnf`

```ini
# Error log
log-error=/var/log/mysql/error.log

# General query log
general_log=ON
general_log_file=/var/log/mysql/mysql.log

# Slow query log
slow_query_log=on
long_query_time=2
slow_query_log_file=/var/log/mysql/slowquery.log
```

> Note: Ensure log files exist and MySQL has write permissions, otherwise the container may fail to start.

---

## Common Operations

### View Logs

```bash
docker logs mysql_db
```

### List Containers

```bash
docker ps
docker ps -a
```

### Install MySQL Client

```bash
yum -y install mysql
```

### Connect to MySQL

```bash
mysql -h 127.0.0.1 -uroot -p
```

### Stop / Start Container

```bash
docker stop mysql_db
docker start mysql_db
```

### Use MySQL from Another Container

```bash
docker run --name some-app --link mysql_db:mysql -d application-that-uses-mysql
```

---

## Summary

Running MySQL in Docker provides:

- Easy setup and teardown
- Environment isolation
- Persistent data via volumes

This approach works well for development and small production setups.
