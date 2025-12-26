---
title: Enforcing Code Style with Checkstyle in Legacy Projects
description: How to introduce Checkstyle into an existing Maven project and validate only newly changed files to avoid massive refactoring.
date: 2017-12-03
tags:
  - id: "checkstyle"
    title: "CheckStyle"
  - id: "maven"
    title: "Maven"
category:
  id: program
  title: Program
---

## Background

After taking over a legacy project, I found that the code style was highly inconsistent.

Naming, comments, formatting—almost every developer who had touched the code left behind a different style.
This made onboarding new team members painful and code reviews inefficient.

To address this, I decided to introduce **Checkstyle** to enforce a consistent coding standard.

<!-- more -->

---

## Why Checkstyle

Checkstyle is a static analysis tool that helps developers follow consistent coding conventions.

Benefits:

- Automated code style validation
- Reduced subjective code review comments
- Easier long-term maintenance

Common style references:

- Sun Code Conventions
- Google Java Style

Official docs:  
http://checkstyle.sourceforge.net/

---

## Maven Checkstyle Plugin

Apache Maven provides an official Checkstyle plugin that:

- Validates code against predefined rules
- Generates reports
- Fails the build on violations (optional)

Docs:  
http://maven.apache.org/plugins/maven-checkstyle-plugin/

---

## Basic Plugin Configuration

Add the following to `pom.xml`:

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-checkstyle-plugin</artifactId>
  <version>2.17</version>
  <executions>
    <execution>
      <id>validate</id>
      <phase>validate</phase>
      <goals>
        <goal>check</goal>
      </goals>
      <configuration>
        <configLocation>checkstyle.xml</configLocation>
        <encoding>UTF-8</encoding>
        <consoleOutput>true</consoleOutput>
        <failsOnError>true</failsOnError>
      </configuration>
    </execution>
  </executions>
</plugin>
```

---

## Avoiding a Legacy-Code Disaster

Running Checkstyle on an old project can produce thousands of violations.
Instead, the goal was to:

> **Validate only new and modified files**

---

## Custom File Filter (SVN Example)

A custom `BeforeExecutionFileFilter` was implemented to only include changed files.

```java
public class CustomBeforeExecutionFileFilter
        extends AutomaticBean
        implements BeforeExecutionFileFilter {

    private static final String CMD = "svn diff --summarize";
    private List<String> changedFiles = new ArrayList<>();
    private boolean initialized = false;

    @Override
    public boolean accept(String uri) {
        if (!initialized) {
            initChangedFileList();
            initialized = true;
        }
        return changedFiles.contains(uri);
    }

    private void initChangedFileList() {
        // execute svn diff command and parse results
    }
}
```

For Git repositories, the SVN command can be replaced with `git diff`.

---

## Update Checkstyle Configuration

Register the custom filter in `checkstyle.xml`:

```xml
<module name="Checker">
    <module name="com.example.checkstyle.CustomBeforeExecutionFileFilter"/>
</module>
```

---

## Summary

Key takeaways:

- Checkstyle is valuable even for legacy projects
- Enforcing style on **only changed files** avoids massive refactoring
- Tooling can improve code quality without blocking progress

Checkstyle works best when introduced incrementally and enforced consistently.
