---
title: "Redis Interview Guide: Concepts, Internals, and Real-World Pitfalls"
description: A comprehensive Redis interview guide covering core concepts, data structures, consistency, persistence, high availability, and production troubleshooting.
date: 2020-07-23
tags:
  - id: "redis"
    title: "Redis"
  - id: "cache"
    title: "Cache"
  - id: "interview"
    title: "Interview"
category:
  id: interview
  title: Interview
---

## Preface

For backend engineers, cache-related questions are almost guaranteed in interviews—and **Redis** is by far the most commonly used caching middleware.

This article organizes common Redis interview questions using a simple but powerful framework:

**WWHH**

1. **WHAT** – What is Redis?
2. **WHY** – Why use Redis?
3. **HOW** – How do you use Redis?
4. **HOW (Internals)** – How does Redis work internally?

Answering along these lines not only demonstrates knowledge, but also shows **structured thinking**.

<!-- more -->

---

## Redis Overview

> Redis is an open-source (BSD licensed), in-memory data structure store, used as a database, cache, and message broker.

Redis supports:

- Strings
- Hashes
- Lists
- Sets
- Sorted Sets
- Bitmaps
- HyperLogLogs
- Streams (Redis 5+)

It also provides:

- Replication
- Lua scripting
- LRU eviction
- Transactions
- Persistence (RDB / AOF)
- High availability (Sentinel)
- Distributed mode (Cluster)

According to DB-Engines rankings, Redis is the most popular key–value store.

---

## Common Redis Interview Questions

### What data structures does Redis support?

**Basic answer:**

> Strings, hashes, lists, sets, and sorted sets.

**Better answer:**

Redis internally optimizes these structures for performance and memory efficiency.
Each logical data type may have multiple internal encodings depending on size and usage.

![Redis 数据结构](/posts/redis-interview/xmind.png)

---

### Why use Redis?

This question tests **WHY** and **HOW**, not just WHAT.

Good answers are **scenario-driven**.

#### Example 1: Caching hot data

- Order or policy data is written infrequently but read frequently
- Cache reduces database load and improves QPS

#### Example 2: Distributed locks

- Used Redis locks to ensure scheduled jobs run on only one instance
- Avoided Quartz complexity in small systems

Follow-up questions often include:

- Cache–DB consistency
- Cache penetration
- Cache avalanche

---

## Cache and Database Consistency

Using Redis introduces **double-write problems**.

The commonly used pattern is:

> **Cache Aside Pattern**

### Read

1. Read cache
2. If cache miss → read DB
3. Write result to cache

### Write

1. **Delete cache**
2. Update database

> Always delete cache **before** updating the database.

This minimizes the window of inconsistency.

---

### Concurrent Consistency Issues

Race condition example:

1. Cache deleted
2. DB update not finished
3. Concurrent read loads old DB data into cache

**Solutions:**

- Serialize access for the same key
- Hash requests by ID to the same service instance
- Delayed double-delete strategy
- Asynchronous compensation

---

## Cache Penetration & Avalanche

### Cache Penetration

Requests for non-existent keys bypass cache and hit DB repeatedly.

**Solutions:**

- Cache empty results with short TTL
- Use Redis Bitmap or Bloom filters

---

### Cache Avalanche

Large numbers of keys expire at the same time or Redis becomes unavailable.

**Solutions:**

- Randomize expiration times
- Use Redis clusters with replication
- Add circuit breakers (e.g., Hystrix-like protection)

---

## Redis Distributed Locks

### Naïve approach

```text
SETNX key value
```

Problems:

- Lock may never be released
- One thread may delete another thread’s lock

### Correct approach

- Use `SET key value NX PX timeout`
- Value is a unique UUID
- Release lock using **Lua script** to ensure atomicity

This prevents accidental lock deletion.

---

## Why Is Redis So Fast Despite Being Single-Threaded?

Key reasons:

1. Pure in-memory operations
2. Non-blocking IO with multiplexing (Reactor pattern)
3. No context switching overhead
4. Highly optimized data structures

Single-threaded design simplifies concurrency and improves predictability.

---

## Redis Persistence

### RDB

- Snapshot-based persistence
- Fast recovery
- Possible data loss between snapshots
- Fork overhead during snapshot

```ini
save 900 1
save 300 10
save 60 10000
```

---

### AOF

- Append-only command log
- Better durability
- Larger files
- Slower recovery

```ini
appendonly yes
appendfsync everysec
```

Redis 4.0+ supports **hybrid RDB+AOF** persistence.

---

## High Availability & Replication

### Master–Slave Replication

Redis supports:

- Full synchronization
- Partial synchronization (PSYNC)

Key components:

- Replication offset
- Replication backlog buffer
- Master ID

Partial resync avoids costly full replication after short disconnections.

---

## Eviction Policies

When memory is full:

- noeviction
- allkeys-lru
- allkeys-random
- volatile-lru
- volatile-random
- volatile-ttl

**Most commonly used:** `allkeys-lru`

---

## Production Issues Encountered

### Hot Key Problem

Symptoms:

- Redis CPU spikes
- Slow responses
- Single key dominates traffic

Diagnosis tools:

- `slowlog get`
- `INFO`
- Application tracing (e.g., Arthas)

![Redis trace](/posts/redis-interview/fuck-and-copy.png)

**Solutions:**

- Add local in-memory cache
- Reduce cached object size
- Optimize serialization
- Shard hot keys

---

## Latest Redis Features

Redis 5+ introduced:

- Streams (lightweight Kafka-like log)
- Module system
- Improved replication
- Better persistence formats

---

## Final Thoughts

Redis interview questions are not about memorization.

They test:

- Real-world experience
- Trade-off awareness
- System thinking

Understanding **why** Redis works the way it does is far more valuable than knowing commands by heart.

---

Originally published as _Redis Interview Guide_.
