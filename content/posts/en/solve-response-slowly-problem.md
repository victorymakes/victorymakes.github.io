---
title: Diagnosing Slow Response Issues in Production Systems
description: A real-world incident analysis of slow responses in a WeChat platform, covering concurrency spikes, Tomcat limits, and database bottlenecks.
date: 2018-04-22
tags:
  - id: "java"
    title: "Java"
  - id: "mysql"
    title: "MySQL"
  - id: "tomcat"
    title: "Tomcat"
category:
  id: program
  title: Program
---

## Problem Description

The system is a **WeChat third-party platform** that hosts Official Accounts and Mini Programs.

One evening around **7:00 PM**, multiple account administrators reported that their official accounts kept showing:

> **“The service provided by this account is temporarily unavailable.”**

Manual verification confirmed the issue, and the problem was **system-wide**, not isolated.

---

## Problem Investigation

### Verify the Issue

Repeated requests all returned the same error message, indicating a global service failure.

<!-- more -->

---

## Check Web Service Logs

### Error Logs

Several exceptions were found in the backend logs:

**Error 1:**

```text
java.io.IOException: APR error: -32
...
```

**Error 2:**

```text
java.lang.IllegalStateException: getOutputStream() has already been called for this response
...
```

Initially, it was suspected that WeChat terminated requests after a 5-second timeout.

---

## Analyze Access Logs

### Response Time Analysis

Access logs showed that request durations were **not exceeding 5 seconds**.

### QPS Analysis

Real-time log inspection revealed:

- Incoming requests were returning **404**
- Requests were being rejected by Tomcat

Tomcat configuration:

```xml
<Connector
    port="31542"
    maxThreads="150"
    acceptCount="200"
    connectionTimeout="40000" />
```

Key limits:

- `maxThreads`: 150
- `acceptCount`: 200

When concurrency exceeded these limits, requests were rejected.

---

## Concurrency Analysis

Peak concurrency reached **400+ requests per second**, exceeding server capacity.

Although concurrency later dropped, the service **did not recover**, suggesting a deeper bottleneck.

---

## System Resource Check

CPU and memory usage were inspected:

![CPU Status](/posts/solve-response-slowly-problem/cpu.jpg)
![Memory Status](/posts/solve-response-slowly-problem/memory.jpg)

Memory was normal.
CPU showed abnormal fluctuations but was not the primary cause.

---

## Database Investigation

DBA analysis revealed:

- MySQL CPU usage jumped from **5% to 100%**
- Query latency increased dramatically
- Write pressure spiked during traffic surge

Historical metrics showed:

- Long-running queries
- High row scans
- CPU saturation under load

---

## Root Cause

Two key issues were identified:

1. Sudden concurrency spike caused excessive database writes
2. Slow SQL queries became significantly worse under CPU constraints

This led to a **feedback loop**:
high concurrency → DB slowdown → request backlog → service failure.

---

## Resolution

Actions taken:

- Optimized slow SQL queries (added indexes)
- Reduced database CPU pressure
- Cleared request backlog

Service recovered after database optimization.

---

## Lessons Learned

1. No traffic estimation for newly integrated large accounts
2. Lack of database slow-query alerts
3. Insufficiently structured troubleshooting approach

Recommended troubleshooting order:

> **Logs → System resources → Database**

---

## Summary

The incident was triggered by a high-traffic official account pushing a popular article,
causing traffic far beyond expected capacity.

Performance issues are rarely caused by a single factor—
they emerge from **system-wide interactions under load**.
