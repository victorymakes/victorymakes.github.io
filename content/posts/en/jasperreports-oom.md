---
title: Handling OutOfMemoryError Issues in JasperReports
description: Practical strategies for diagnosing and mitigating OutOfMemoryError problems when exporting large PDFs with JasperReports.
date: 2018-02-28
tags:
  - id: "java"
    title: "Java"
  - id: "jasperreports"
    title: "JasperReports"
  - id: "oom"
    title: "OOM"
category:
  id: program
  title: Program
---

## Problem Description

In this project, **JasperReports** is used to generate and export PDF files.
However, during the export process, the system occasionally encounters **OutOfMemoryError (OOM)** exceptions,
which can render the production system completely unavailable.

The main causes of OOM issues fall into two categories:

1. Poorly designed Jasper template files that cause JasperReports to enter infinite loops
2. Reports that are genuinely too large and exceed the available memory limits

Similar production incidents were discussed previously in:
**Troubleshooting High CPU Usage in Production Java Applications**

<!-- more -->

---

## Root Cause Analysis

Since the problem is caused by excessive memory consumption, mitigation strategies should target both root causes.

---

## 1. Poor Jasper Template Design

When designing report templates, enabling the option:

> **Print When Detail Overflows**

can easily lead to OOM issues.

The JasperReports team considers this a **template design issue** and does not plan to fix it internally.
Therefore, responsibility falls on developers to enforce strict validation.

### Solution 1: SVN Hook Validation

Use SVN hooks to validate templates before commit.

High-level design:

1. Use `svnlook changed` to obtain the list of modified files
2. Pass changed Jasper files to a Java program
3. Use JasperReports APIs to inspect template properties

Example code:

```java
JasperReport report =
    (JasperReport) JRLoader.loadObjectFromFile(filePath);

boolean overflowEnabled =
    Boolean.valueOf(
        report.getPropertiesMap()
              .getProperty(JRXmlConstants.ATTRIBUTE_isPrintWhenDetailOverflows)
    );
```

---

### Solution 2: JasperReports Configuration

Add a `jasperreports.properties` file to the classpath and configure:

```
net.sf.jasperreports.consume.space.on.overflow=true
```

This option forces expanding text fields to consume remaining page space
and is supported starting from **JasperReports 6.3.1**.

---

## 2. Reports Require Large Amounts of Memory

When large reports are unavoidable, memory usage must be controlled explicitly.

### Solution 1: Reduce Memory Usage with Virtualizer

JasperReports provides a **Virtualizer** mechanism that swaps report data to disk instead of memory.

This significantly reduces heap usage at the cost of slower report generation.

Reference:

- JasperReports Virtualizer Sample

---

### Solution 2: Enforce Execution Limits

Virtualizers do not protect against infinite loops.
Therefore, execution limits should be enforced.

Key configuration options:

- Maximum page count
- Maximum execution time

Example configuration in `jasperreports.properties`:

```properties
# Maximum execution time: 60 seconds
net.sf.jasperreports.governor.timeout.enabled=true
net.sf.jasperreports.governor.timeout=60000

# Maximum number of pages
net.sf.jasperreports.governor.max.pages.enabled=true
net.sf.jasperreports.governor.max.pages=10
```

If a report exceeds these limits, execution is terminated automatically.

---

## References

- JasperReports Configuration Reference
- JasperReports Ultimate Guide
- JasperReports Sample Reference

---

## Conclusion

JasperReports OOM issues are usually caused by **template design flaws** or **unbounded resource usage**.

Effective prevention strategies include:

- Enforcing template validation
- Using disk-based virtualization
- Applying execution governors

With proper safeguards in place, JasperReports can be used reliably even in production environments.
