---
title: Troubleshooting High CPU Usage in Production Java Applications
description: A systematic approach to diagnosing and resolving high CPU usage issues in production Java systems, based on real-world experience.
date: 2017-09-24
tags:
  - id: "java"
    title: "Java"
  - id: "cpu"
    title: "CPU"
  - id: "production"
    title: "Production"
category:
  id: program
  title: Program
---

## Overview

One of the projects I was responsible for used **iReport + JasperReports** to implement a printing system.
Recently, the production system frequently became unresponsive. Restarting the service would temporarily
resolve the issue, but the problem kept recurring.

After investigation, the root cause turned out to be **JasperReports consuming excessive memory**, which
triggered continuous garbage collection (GC) and caused CPU usage to spike dramatically.

This article documents the **diagnostic process and methodology** used to identify the issue.

<!-- more -->

---

## Environment

- Tomcat 7
- JDK 7
- Linux

---

## Investigation Process

### 1. Check Application Logs

First, I reviewed the application logs. All requests appeared normal, and no exceptions were reported.
This suggested that the problem was likely related to **system resource exhaustion** rather than functional errors.

---

### 2. Inspect System Resource Usage

Use the `top` command to observe CPU and memory usage:

```bash
top
```

Example output:

```text
Cpu(s): 57.6%us, 6.3%sy, 9.2%id, 26.2%wa
Mem: 3922928k total, 3794232k used, 128696k free
```

The Java process was consuming nearly **190% CPU** and over **28% memory**.

---

### 3. Identify High-CPU Threads

```bash
ps -mp <pid> -o THREAD,tid,time
```

This revealed two threads consistently consuming around **45% CPU** each.

---

### 4. Convert Thread ID to Hexadecimal

```bash
printf "%x\n" <tid>
```

---

### 5. Capture Thread Stack Traces

```bash
jstack <pid> | grep <hex_tid>
```

Sample output:

```text
"GC task thread#0 (ParallelGC)" runnable
"GC task thread#1 (ParallelGC)" runnable
```

These were clearly **GC threads**, indicating excessive garbage collection.

---

### 6. Analyze JVM Memory Usage

```bash
jstat -gcutil <pid> 2000 10
```

Output showed:

- Young generation usage: **100%**
- Old generation usage: **100%**
- Full GC count increasing rapidly

This confirmed severe memory pressure.

---

## Heap Dump Analysis

To further analyze memory usage, a heap dump was generated:

```bash
jmap -dump:format=b,file=dump.bin <pid>
```

The dump was analyzed locally using **VisualVM**.

Findings:

- `net.sf.jasperreports.engine.fill.JRTemplatePrintText` objects dominated memory usage
- These objects accounted for **over 58% of heap memory**

---

## Root Cause

JasperReports was creating an excessive number of objects during report rendering.
When memory became insufficient, the JVM continuously triggered Full GC, causing CPU usage to skyrocket.

---

## Resolution

There is no perfect fix without modifying JasperReports internals, but the issue can be mitigated by:

1. Disabling **Print When Detail Overflows**
2. Enabling JasperReports **Virtualizer** to offload memory to disk

Example Virtualizer usage:

```java
JRVirtualizer virtualizer =
    new JRFileVirtualizer(100, "/tmp");
```

These changes significantly reduced memory pressure and stabilized CPU usage.

---

## Lessons Learned

- High CPU usage often originates from memory issues
- GC threads can dominate CPU under memory pressure
- JVM diagnostic tools (`top`, `jstack`, `jstat`, `jmap`) are essential
- Heap dump analysis provides decisive evidence

---

## Conclusion

This case reinforced the importance of understanding JVM internals and having a structured
troubleshooting methodology.

Performance issues rarely resolve themselves—systematic analysis is the only reliable way
to identify and fix them in production environments.
