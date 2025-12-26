---
title: Publishing Your Own Open Source Project to Maven Central
description: A step-by-step guide to open-sourcing a Java project and publishing it to Maven Central using Sonatype OSSRH.
date: 2020-07-23
tags:
  - id: "java"
    title: "Java"
  - id: "maven"
    title: "Maven"
category:
  id: program
  title: Program
---

## Introduction

After writing code for years and relying on third-party dependencies, many developers eventually start wondering:

> _What if others could use my own open source library one day?_

Let’s start with something simple: extract a small project, open source it, and publish it to **Maven Central** so others can use it directly via Maven dependencies.

The biggest challenge for most people is not the publishing process itself—but figuring out **what to build**. This article walks through both the **idea selection** and the **technical steps** required to publish a project to Maven Central.

<!-- more -->

---

## Choosing a Project Idea

Many developers want to open source something but don’t know where to start. That’s completely normal.

Instead of building a large and complex framework, the goal here is to **experience the full release process**. A great and simple starting point is:

> **Wrapping public APIs into Java SDKs**

Many platforms provide HTTP-based APIs but do not offer official Java clients. This is an excellent opportunity to:

- Practice API design
- Provide real value to other developers
- Publish a reusable library

Examples of platforms with public APIs:

- WeChat
- Pinterest
- Weibo
- Medium
- Hacker News

Pick one that:

- Does not already have a good Java SDK
- Or has an implementation you believe can be improved
- Or simply interests you

---

## Versioning Strategy

Once development starts, version management becomes critical.

### Semantic Versioning

Maven projects typically follow **Semantic Versioning**: `MAJOR.MINOR.PATCH`

- **MAJOR**: incompatible API changes
- **MINOR**: backward-compatible feature additions
- **PATCH**: backward-compatible bug fixes

Additional qualifiers:

- `alpha` – internal testing
- `beta` – public testing
- `rc` – release candidate
- `lts` – long-term support

Reference: https://semver.org

---

## GitHub Version Management

For small personal projects, GitHub tags are more than sufficient.

Each time you release a stable version to Maven Central, create a corresponding Git tag.

```bash
git tag -a 1.0.0 -m "First stable release"
git push origin 1.0.0
```

This allows users to easily map Maven versions to source code.

---

## Preparing for Maven Central Publishing

Publishing to Maven Central requires using **Sonatype OSSRH**.

### Step 1: Register a Sonatype Account

Sign up at:
https://issues.sonatype.org

### Step 2: Create a Jira Ticket

Create a ticket requesting permission to publish under your chosen `groupId`.

Important notes:

- You must own or control the domain used in `groupId`
- Alternatively, you can use:
  - `com.github.username`
  - `io.github.username`
- After your first release, comment on the ticket to notify OSSRH
- Once the ticket is marked **RESOLVED**, you may publish artifacts

---

## Generating a GPG Key

Artifacts uploaded to Maven Central must be **GPG signed**.

### Linux

Follow:
https://central.sonatype.org/pages/working-with-pgp-signatures.html

### Windows

Use **Kleopatra**:
https://gpg4win.org/download.html

General steps:

1. Create a new OpenPGP key pair
2. Fill in personal information
3. Set a passphrase
4. Upload the public key to a key server

---

## Updating `pom.xml`

### Project Metadata

```xml
<licenses>
  <license>
    <name>The Apache License, Version 2.0</name>
    <url>http://www.apache.org/licenses/LICENSE-2.0.txt</url>
  </license>
</licenses>

<scm>
  <url>https://github.com/yourname/project.git</url>
  <connection>scm:git:https://github.com/yourname/project.git</connection>
</scm>

<developers>
  <developer>
    <name>yourname</name>
    <email>you@example.com</email>
  </developer>
</developers>
```

### Build Plugins

Source and Javadoc artifacts are **mandatory**:

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-source-plugin</artifactId>
</plugin>

<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-javadoc-plugin</artifactId>
</plugin>
```

### Release Profile

Configure the `release` profile with:

- Nexus staging plugin
- Maven release plugin
- GPG signing plugin

---

## Maven `settings.xml` Configuration

```xml
<servers>
  <server>
    <id>oss</id>
    <username>SONATYPE_USERNAME</username>
    <password>SONATYPE_PASSWORD</password>
  </server>
</servers>

<profiles>
  <profile>
    <id>oss</id>
    <properties>
      <gpg.passphrase>YOUR_GPG_PASSPHRASE</gpg.passphrase>
    </properties>
  </profile>
</profiles>
```

---

## Publishing Artifacts

### Snapshot Release

```xml
<version>1.2.0-SNAPSHOT</version>
```

```bash
mvn clean deploy
```

Artifacts appear at:
https://oss.sonatype.org/content/repositories/snapshots/

---

### Release Version

```xml
<version>1.2.0</version>
```

```bash
mvn clean deploy -P release
```

After approval, artifacts become available on:
https://mvnrepository.com

---

## Conclusion

Publishing to Maven Central is not difficult, but it does require attention to detail.

Once completed, you gain:

- A deeper understanding of Java build tooling
- Experience with open source release workflows
- A public artifact others can depend on

If you’ve ever considered open sourcing a project—this is the perfect place to start.
