---
title: "A Deep Dive into Delayed Tasks: From Thread Pools to Timing Wheels"
description: An in-depth exploration of delayed task scheduling, comparing common approaches such as ScheduledThreadPoolExecutor, timing wheels, and QMQ's delay message implementation.
date: 2020-09-14
tags:
  - id: "netty"
    title: "Netty"
  - id: "qmq"
    title: "QMQ"
category:
  id: program
  title: Program
---

## Background

Delayed tasks are a very common requirement in software systems.
Throughout a developer’s career, most engineers will encounter this problem in one form or another.

Common real-world scenarios include:

- Sending reminders when an order is unpaid
- Delayed SMS notifications after order creation
- Refunding unclaimed coupons or red packets
- Travel reminders before a scheduled trip
- Scheduled publishing of content (e.g., WeChat official accounts)

---

## Core Components of a Delayed Task System

A typical delayed task system consists of three core modules:

- **Storage**  
  Responsible for persisting task metadata such as execution time, retry count, and payload.

- **Scheduler**  
  Determines whether a task has reached its execution time.

- **Executor**  
  Executes the task when it becomes due.

In a **monolithic system**, these components often live within the same application.
In a **distributed system**, they are usually separated, and a single logical task may be split
across multiple services.

In this article, we focus on **monolithic delayed task implementations**, which form the foundation
of more complex distributed solutions.

<!-- more -->

---

## Common Solutions

### In-Process Approaches

- `ScheduledThreadPoolExecutor`
- Timing Wheel (`HashedWheelTimer`)

### Out-of-Process Approaches

- Dedicated schedulers (Quartz, Elastic-Job, QSchedule)
- Delayed messaging systems (Kafka, RocketMQ, QMQ)
- Custom implementations based on Redis or MySQL

This article focuses on **in-process approaches**, followed by a deep dive into **QMQ’s delay message design**.

---

## ScheduledThreadPoolExecutor

### Core APIs

- `schedule(Runnable command, long delay, TimeUnit unit)`
- `scheduleAtFixedRate(Runnable command, long initialDelay, long period, TimeUnit unit)`
- `scheduleWithFixedDelay(Runnable command, long initialDelay, long delay, TimeUnit unit)`

### Implementation Highlights

- Extends `ThreadPoolExecutor`
- Uses `DelayedWorkQueue`, a heap-based unbounded blocking queue
- Implements the **Leader-Follower** threading model

---

## Leader-Follower Threading Model

The Leader-Follower design minimizes overhead by avoiding frequent thread creation and context switching.

![Leader-follower](/posts/figure-out-delay-task/leader_follower.png)

Key characteristics:

- Threads transition between **leader**, **processor**, and **follower**
- Only one leader thread waits for the next task
- Followers compete to become the next leader
- Processing threads execute tasks

This model efficiently balances concurrency and synchronization.

[Explain “Leader/Follower” Pattern](https://stackoverflow.com/questions/3058272/explain-leader-follower-pattern)

---

## Timing Wheel

A timing wheel is a high-performance data structure for managing large volumes of delayed tasks.
It binds all delayed tasks to a single scheduler, reducing CPU overhead.

### Basic Timing Wheel

![Basic Timing Wheel](/posts/figure-out-delay-task/time_round_1.png)

Key concepts:

- **tickDuration**: the minimum time unit
- **wheelSize**: number of slots
- **interval**: total time span of the wheel

Tasks are placed into slots using modulo arithmetic.
Insertion and removal are both **O(1)** operations.

### Limitations

- Large intervals require many slots, increasing memory usage
- Precision is limited by tick duration
- No built-in crash recovery

---

## Hierarchical Timing Wheel

![Hierarchical Timing Wheel](/posts/figure-out-delay-task/time_round_3.png)

To address memory and scalability issues, **hierarchical timing wheels** are introduced.

This design resembles a clock:

- Seconds wheel
- Minutes wheel
- Hours wheel

Each higher-level wheel advances when the lower wheel completes a full rotation.

This drastically reduces memory usage while supporting long delays.

---

## QMQ Delayed Message Design

QMQ supports flexible delayed messages with second-level precision and delays up to two years.

![QMQ](/posts/figure-out-delay-task/qmq_arch.png)

### Key Components

- **Meta Server**: cluster management and discovery
- **Delay Server**: manages delayed messages
- **Server**: handles real-time messages
- **Producer / Consumer**

### Core Logs

![QMQ Logs](/posts/figure-out-delay-task/qmq_delay.png)

- **Message Log**: write-ahead log for incoming messages
- **Schedule Log**: organizes messages by delivery time
- **Dispatch Log**: records delivered message offsets

### Execution Flow

![QMQ Execution Flow](/posts/figure-out-delay-task/qmq_delay_fllow.png)

1. Producer sends delayed message
2. Message is written to message log
3. Message is scheduled via timing wheel
4. Delay server dispatches message at the correct time
5. Dispatch log ensures idempotency after restarts

---

## Key Takeaways

- Delayed tasks are a fundamental building block of many systems
- Heap-based schedulers struggle at large scale
- Timing wheels offer O(1) performance for massive workloads
- Hierarchical timing wheels balance memory and precision
- QMQ combines timing wheels with persistent logs for reliability

---

## Conclusion

Understanding delayed task scheduling is critical for building reliable systems.
While simple solutions work at small scale, advanced approaches such as timing wheels
and delayed messaging systems are essential for large-scale, production-grade systems.
