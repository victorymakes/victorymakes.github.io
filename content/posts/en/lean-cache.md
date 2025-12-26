---
title: "Cache Consistency Strategies: How to Safely Update Cache and Database"
description: A practical discussion on cache update strategies using Redis, focusing on consistency, concurrency, and real interview scenarios.
date: 2017-05-20
tags:
  - id: "interview"
    title: "Interview"
  - id: "cache"
    title: "Cache"
category:
  id: interview
  title: Interview
---

## Introduction

In modern web systems of a certain scale, **caching** is almost always introduced to reduce database pressure
and improve response times.

Redis is a very common choice for this purpose.

During recent interviews, cache-related questions came up frequently. One particularly interesting topic was:

> **How should cache be updated to ensure data consistency under high concurrency?**

This article walks through a real interview discussion and arrives at a practical solution.

<!-- more -->

---

## Typical Cache Architecture

In most systems, the cache architecture looks like this:

```
Client -> Cache (Redis) -> Database
```

The typical read flow is:

1. Read data from cache
2. If cache hit, return data directly
3. If cache miss, read from database and write back to cache

This works well for **read-heavy, write-light** scenarios.

---

## Interview Scenario

During an interview, I mentioned that I had used Redis to cache frequently read but rarely updated data,
such as:

- Game configuration
- Activity configuration
- User history data

The interviewer then asked:

> **What cache update strategy do you use?**

My initial answer was:

> Update the database first, then update the cache.

The interviewer followed up:

> What if the database update succeeds, but the cache update fails?

This would lead to **data inconsistency**.

---

## Naïve Solutions and Their Problems

### Delete Cache Before Updating DB

I suggested:

> Delete the cache first, then update the database.

The interviewer pointed out another race condition:

1. Cache is deleted
2. Database update has not completed yet
3. Another request reads old data from DB and writes it back to cache

Result: **stale data re-enters the cache**.

---

### Locking

Another idea was:

> Lock the data during update.

While locking can work, it significantly reduces concurrency and scalability.

Clearly, a better approach is needed.

---

## Problem Restatement

Assume a table:

```
account(uid, balance)
```

Characteristics:

- Read-heavy
- Write-light

The read flow:

1. Read from cache
2. On miss, read from DB and populate cache

The key questions:

1. Update cache or delete cache?
2. Update DB first or cache first?

---

## Recommended Solution

### 1. Prefer Cache Eviction Over Update

Updating cache can be complex and error-prone.

**Cache eviction** is simpler and usually results in only one extra cache miss.

Therefore:

> **Prefer deleting cache entries instead of updating them.**

---

### 2. Operation Order Matters

Compare the two strategies:

#### DB First, Then Evict Cache

- DB update succeeds
- Cache eviction fails
- Cache contains stale data → inconsistency

#### Evict Cache First, Then Update DB

- Cache eviction succeeds
- DB update fails
- Only causes one cache miss

✅ **Evict cache first, then update DB**

---

### 3. Serialize Access to the Same Data

To further reduce race conditions, ensure **serialized access** for the same data item.

Possible approaches:

- Route requests by hashing `id` to the same service instance
- Route DB connections by hashing `id`
- Ensure single-writer semantics per key

---

## Final Takeaways

- Cache consistency is a classic distributed systems problem
- Cache eviction is safer than cache update
- Always evict cache **before** updating the database
- Serializing access can further reduce inconsistencies

---

## References

- Cache Architecture Design Details
- Cache and Database Consistency
- Redundancy Data Consistency Patterns
