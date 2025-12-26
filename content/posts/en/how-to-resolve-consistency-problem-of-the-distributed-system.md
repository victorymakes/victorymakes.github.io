---
title: Handling Consistency Problems in Distributed Systems
description: A practical overview of why consistency issues occur in distributed systems and how to design for eventual consistency using proven patterns.
date: 2018-03-12
tags:
  - id: "thinking"
    title: "Thinking"
  - id: "distributed"
    title: "Distributed"
category:
  id: reading
  title: Reading
---

## Why Consistency Problems Occur

In traditional **monolithic architectures**, data state changes usually happen within the same service and database.
Databases that follow **ACID** properties provide **strong consistency**, meaning inconsistent states are not visible to users.

For example, relational databases such as MySQL ensure strong consistency through mechanisms like **MVCC (Multi-Version Concurrency Control)**.

However, as systems evolve:

- User traffic increases
- Data volume grows rapidly
- Services become more complex

Many systems migrate from monolithic architectures to **service-oriented** or **microservice architectures**.

Microservices are a double-edged sword:

- ✅ They improve agility, scalability, and deployment efficiency
- ❌ They introduce network communication, which is **inherently unreliable**

Once services communicate over a network, **partial failures** become unavoidable, and consistency issues start to appear.

<!-- more -->

---

## Consistency Models

### Strong Consistency

After an update completes, all subsequent reads return the latest value.

- Most user-friendly
- Requires sacrificing availability (CAP theorem)

### Weak Consistency

The system does not guarantee that reads will immediately reflect the latest writes.

- No guarantee on when data becomes consistent

### Eventual Consistency

A special form of weak consistency.

- The system guarantees that, **if no new updates occur**, data will eventually become consistent
- DNS is a classic example

The inconsistency window depends on:

- Network latency
- System load
- Replication strategy

---

## CAP Theorem

CAP defines three properties of distributed systems:

- **Consistency (C)**: All nodes see the same data at the same time
- **Availability (A)**: Every request receives a response
- **Partition Tolerance (P)**: The system continues to operate despite network partitions

> **A distributed system can only guarantee two of the three properties simultaneously.**

---

## BASE Theory

BASE is a practical approach for large-scale distributed systems that relaxes strong consistency.

- **Basically Available**: The system remains available
- **Soft State**: State may change over time, even without new input
- **Eventually Consistent**: Data becomes consistent over time

BASE sacrifices strong consistency to achieve high availability and scalability.

---

## How to Achieve Eventual Consistency

When systems grow large and data is horizontally partitioned, strong consistency becomes expensive or impossible.

The core idea behind eventual consistency is:

> **Query → Detect → Compensate**

---

## Query: Tracking Operation State

To detect inconsistencies, systems must:

1. **Persist operation state**
2. **Uniquely identify each operation**

### Persisting Operation State

Before executing an operation (or sending a message):

- Persist an operation record with status **PENDING**
- Execute the operation
- Update status to **SUCCESS** or **FAILED**

This record is stored in a **reliable, independent system** (database or message store).

---

### Unique Operation Identification

Each operation must have a **globally unique ID**.

Common approaches:

- **Persistent IDs**  
  Generated via database sequences or auto-increment fields

- **Time-based IDs**  
  Combine timestamp, machine ID, and sequence number  
  (e.g., Twitter Snowflake)

---

## Compensation Strategies

### Immediate Compensation

Immediately verify the execution result after an operation and retry or roll back if needed.

### Periodic Reconciliation

Asynchronously batch-verify operation states and compensate when inconsistencies are found.

- Common in financial systems
- Used for transaction and settlement reconciliation

These strategies can be used independently or together.

---

## Handling Timeouts

Timeouts introduce uncertainty:

> Did the operation fail, or did the response just get lost?

This ambiguity requires careful design.

---

## Interaction Patterns

### Synchronous Calls

- Suitable for short, high-frequency operations
- Example: JDBC

### Asynchronous Calls

- Decouples caller and callee
- Improves resilience

### Message Queue Pattern

- Producer sends message without waiting for consumer result
- Ideal for event-driven systems

Example use cases:

- Order creation → logistics processing
- User registration → notification services

---

## Timeout Compensation Principles

General rules:

- If **Service B acknowledges receipt**, Service A can consider the operation complete
- If **no acknowledgment is received**, Service A must retry

This requires:

- Idempotent message handling
- Duplicate detection

---

## Key Takeaways

- Network failures are unavoidable in distributed systems
- Strong consistency does not scale well
- Eventual consistency is often the best trade-off
- Compensation mechanisms are essential
- Idempotency and unique identifiers are critical

---

## Conclusion

Consistency problems are not bugs—they are an inherent property of distributed systems.

Designing for **eventual consistency** requires accepting partial failures and building robust detection and compensation mechanisms.

A well-designed distributed system does not avoid inconsistency—it **manages it gracefully**.
