---
title: "Troubleshooting a Gradle Build Failure: Missing DoNotMock"
description: A real-world case study of diagnosing and fixing a Gradle build failure caused by dependency conflicts in error_prone_annotations.
date: 2019-08-24
tags:
  - id: "gradle"
    title: "Gradle"
  - id: "java"
    title: "Java"
category:
  id: program
  title: Program
---

## Problem Description

After a project update, the build suddenly started failing with the following error:

```bash
error: cannot access DoNotMock
  class file for com.google.errorprone.annotations.DoNotMock not found
```

The project could not be built successfully anymore.

---

## Problem Investigation

### 1. Review Recent Code Changes

The first step was to review the recent changes.
No suspicious logic changes were found—only some updates to **proto file definitions**.

However:

- Reverting the code fixed the build
- Re-applying the changes broke it again

This confirmed that the issue was introduced by this update.

<!-- more -->

---

### 2. Identify the Root Cause from the Error

The error clearly indicated a **missing class** problem.

After some investigation, it turned out that:

- `DoNotMock` belongs to **error-prone**
- The annotation was **removed starting from error-prone 2.3.0**
- Related discussion: https://github.com/google/error-prone/issues/572

The project originally depended on:

```xml
<dependency>
    <groupId>com.google.errorprone</groupId>
    <artifactId>error_prone_annotations</artifactId>
    <version>2.2.0</version>
</dependency>
```

---

### 3. Analyze Dependency Tree

To understand which version was actually used, the dependency tree was inspected:

```bash
./gradlew dependencies -q --configuration compile | grep error_prone_annotations -C 10
```

The output showed that **error_prone_annotations 2.3.2** was being pulled in transitively by other dependencies
(e.g., `protobuf-java-util`).

This version no longer contained `DoNotMock`, which caused the compilation failure.

---

## Solutions

There are **three possible solutions**, depending on project constraints.

---

### Solution 1: Force a Compatible Version (Recommended)

Force Gradle to use a version that still contains `DoNotMock`:

```groovy
implementation('com.google.errorprone:error_prone_annotations:2.2.0') {
    force = true
}
```

---

### Solution 2: Exclude the Conflicting Dependency

Exclude the newer `error_prone_annotations` from the dependency that introduces it:

```groovy
compile("io.dropwizard.modules:dropwizard-protobuf:${dropwizardProtobufVersion}") {
    exclude group: 'com.google.errorprone', module: 'error_prone_annotations'
}
```

---

### Solution 3: Upgrade All Related Dependencies

Upgrade all dependencies that rely on `DoNotMock` so they no longer reference it.

⚠️ This approach has the **largest impact** and requires careful verification.

---

## Why This Happened

Although no direct dependency versions were changed, the update introduced **gRPC-related code**.

gRPC compilation pulled in additional dependencies, which in turn upgraded `error_prone_annotations`
to a version incompatible with existing code.

```bash
error: cannot access DoNotMock
  class file for com.google.errorprone.annotations.DoNotMock not found
```

---

## Summary

Key takeaways:

- Transitive dependencies can silently introduce breaking changes
- Always inspect the dependency tree when unexplained build errors occur
- Forcing dependency versions is sometimes necessary in large projects
- Small changes (like proto updates) can trigger deep dependency conflicts

This case highlights the importance of **dependency awareness** in modern Java builds.
