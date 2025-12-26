---
title: "Getting Started with Drone: CI/CD Powered by Docker"
description: An introductory guide to Drone CI/CD, explaining its core concepts, Docker-based pipelines, and a practical setup with GitHub.
date: 2019-06-21
tags:
  - id: "ci"
    title: "CI"
  - id: "cd"
    title: "CD"
  - id: "drone"
    title: "Drone"
  - id: "docker"
    title: "Docker"
category:
  id: program
  title: Program
---

## Introduction

**Drone** is a CI/CD tool built entirely on **Docker**.  
All build, test, and deployment steps are executed inside Docker containers.

Its core philosophy can be summarized as:

> **Configuration as Code + Docker**

Each project defines its pipeline in a YAML file (by default `.drone.yml`).  
Every pipeline step runs in an isolated Docker container, making builds reproducible and environment-independent.

Drone integrates seamlessly with multiple source code management platforms, including:

- GitHub
- Bitbucket
- GitLab
- Gitea
- Gogs

In this article, GitHub is used as an example to demonstrate how to automatically build and deploy a GitHub Pages project to a personal server using Drone.

<!-- more -->

---

## Preparing to Run Drone

Drone consists of two core services:

- **drone-server**: Handles the web UI, authentication, and pipeline scheduling
- **drone-runner (agent)**: Executes pipeline jobs

For simplicity and maintainability, both services are managed using **docker-compose**.

---

## Installing Docker

### Remove Old Versions (If Any)

```bash
yum remove docker \
            docker-client \
            docker-client-latest \
            docker-common \
            docker-latest \
            docker-latest-logrotate \
            docker-logrotate \
            docker-engine
```

### Install Docker CE

1. Install required dependencies:

   ```bash
   yum install -y yum-utils device-mapper-persistent-data lvm2
   ```

2. Add Docker repository:

   ```bash
   yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
   ```

3. Install Docker CE:

   ```bash
   yum install docker-ce docker-ce-cli containerd.io
   ```

4. Start Docker:

   ```bash
   systemctl start docker
   ```

5. Verify installation:

   ```bash
   docker run hello-world
   ```

If you see the `hello-world` output, Docker is running correctly.
![docker](/posts/drone-for-beginner/docker-hello-world.png)

---

## Installing Docker Compose

1. Enable EPEL repository:

   ```bash
   yum install -y epel-release
   ```

2. Install pip:

   ```bash
   yum install -y python-pip
   ```

3. Install docker-compose:

   ```bash
   pip install docker-compose
   ```

If you encounter the error:

> Command "python setup.py egg_info" failed

Run:

```bash
pip install --upgrade setuptools
```

---

## Running Drone Services

### Step 1: Create a GitHub OAuth App

Navigate to:

```
GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
```

After creation, you will obtain a **CLIENT_ID** and **CLIENT_SECRET**.
![Create Apps](/posts/drone-for-beginner/drone-github.png)

---

### Step 2: Create `docker-compose.yml`

Create the file under `/etc/drone`:

```yaml
version: "3"
services:
  drone-server:
    image: drone/drone:1
    restart: always
    ports:
      - "8000:80"
      - "8443:443"
    volumes:
      - /var/lib/drone:/data
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - DRONE_OPEN=true
      - DRONE_SERVER_PROTO=https
      - DRONE_TLS_AUTOCERT=true
      - DRONE_SERVER_HOST=drone.example.com
      - DRONE_RUNNER_CAPACITY=2

      # GitHub integration
      - DRONE_GITHUB_SERVER=https://github.com
      - DRONE_GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
      - DRONE_GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}

      # Required secret
      - DRONE_RPC_SECRET=${DRONE_RPC_SECRET}

      # Logging
      - DRONE_LOGS_DEBUG=true
      - DRONE_LOGS_TEXT=true
      - DRONE_LOGS_PRETTY=true
      - DRONE_LOGS_COLOR=true

      # Admin user
      - DRONE_USER_CREATE=username:yourname,admin:true

  drone-runner:
    image: drone/agent:1
    restart: always
    depends_on:
      - drone-server
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - DRONE_RPC_SERVER=drone.example.com
      - DRONE_RPC_SECRET=${DRONE_RPC_SECRET}
      - DRONE_RUNNER_CAPACITY=2
```

---

### Step 3: Start Drone

```bash
docker-compose up -d
```

---

## Apache Reverse Proxy Configuration (Optional)

If ports 80 and 443 are already occupied, configure Apache as a reverse proxy:

```apache
<VirtualHost *:80>
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:8000/
    ProxyPassReverse / http://127.0.0.1:8000/
</VirtualHost>
```

![Drone Service](/posts/drone-for-beginner/drone-web.png)

---

## Configuring CI/CD for a Project

### Sample `.drone.yml`

```yaml
kind: pipeline
name: default

steps:
  - name: build
    image: node
    commands:
      - npm install
      - npm run build
```

Whenever code is pushed, Drone automatically triggers the pipeline.

---

## Improving the Pipeline

Drone supports publishing to multiple targets, such as:

- Local server
- GitHub Pages
- Other static hosting platforms

Using plugins and custom Docker images, complex multi-target deployments can be achieved.

---

## Summary

Drone embraces modern DevOps principles:

- Docker-native execution
- Declarative pipelines
- Strong integration with Git platforms
- Simple yet powerful configuration

For teams seeking a lightweight, container-based CI/CD solution, Drone is an excellent choice.
