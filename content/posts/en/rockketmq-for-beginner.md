---
title: "RocketMQ Overview: Architecture, Components, and Message Flow"
description: An in-depth overview of Apache RocketMQ, covering its core features, NameServer, Broker, Client internals, and message storage.
date: 2019-11-18
tags:
  - id: "rocketmq"
    title: "RocketMQ"
  - id: "java"
    title: "JAVA"
  - id: "big-data"
    title: "Big Data"
category:
  id: program
  title: Program
---

## Introduction

**Apache RocketMQ** is a high-performance, high-throughput distributed message middleware originally open-sourced by Alibaba.
Compared with Kafka, RocketMQ emphasizes **lower latency and stronger reliability**, making it especially suitable for
**financial and money-related systems**.

Key features include:

- **Publish / Subscribe messaging**
  - Consumer groups ensure that only one instance in a group consumes a message.
- **Delayed messages**
  - Supports fixed delay levels such as `1s, 5s, 10s, 30s, 1m ... 2h` (18 levels by default).
  - Messages are first placed into delay queues and later moved to the real topic by background schedulers.
- **Ordered messages**
  - Ordering is guaranteed only within a single queue on a single broker.
- **Message persistence**
  - Synchronous replication + synchronous disk flush ensure durability.
  - After version 4.5, **DLedger** supports automatic master–slave failover.
- **Message filtering**
  - Filter by tag or custom properties on the broker side to reduce network traffic.
- **Message replay**
  - Re-consume messages by time or key for troubleshooting.
- **Transactional messages**
  - Implemented via a 2PC-like mechanism with transaction checks.
- **Dead-letter queues**
  - Messages that exceed retry limits are moved to DLQ for manual handling.
- **Retry mechanism**
  - Retry queues per consumer group with scheduled delays.
- **At-least-once delivery**
  - Messages are acknowledged only after successful consumption.

<!-- more -->

---

## Overall Architecture

RocketMQ consists of three main parts:

- **NameServer**
- **Broker**
- **Client (Producer & Consumer)**

Physical deployment overview:

![RocketMQ Physical Architecture](/posts/rockketmq-for-beginner/RocketMQ_A.png)

- **NameServer**
  - Stores topic routing information
  - NameServers do not communicate with each other
- **Broker**
  - Supports master–slave roles
  - Brokers register themselves to all NameServers periodically
- **Client**
  - Periodically fetches routing info from NameServers
  - Sends heartbeats to all Brokers

---

## NameServer

The NameServer plays a role similar to ZooKeeper in Kafka, acting as a **routing registry**.
Unlike ZooKeeper, NameServers are **stateless and independent**.

### Responsibilities

- Maintain broker and topic routing information
- Respond to route queries from clients
- Remove inactive brokers

### Startup Flow (RocketMQ 4.5.2)

- Build `NamesrvController`
- Initialize controller
- Start network services and scheduled tasks

Key behaviors:

- Start Netty remoting server
- Register request processors
- Periodically scan inactive brokers
- Periodically dump configuration

---

## NameServer Request Processing

NameServer handles requests such as:

- Configuration management
- Broker registration / unregistration
- Topic route queries
- Cluster metadata queries

Broker registration acts as a **heartbeat mechanism**, allowing NameServer to keep routing information fresh.

---

## Client

RocketMQ clients include **producers** and **consumers**.

Clients periodically:

- Fetch routing information from NameServers
- Send heartbeats to all Brokers

---

## Producer

### Startup

When a producer starts:

1. Register the producer group
2. Start `MQClientInstance`
3. Fetch NameServer addresses if not configured
4. Start background services:
   - Route updates
   - Heartbeats
   - Offset persistence
   - Rebalance services

---

### Message Sending

Important considerations:

- **Broker & queue selection**
  - Based on routing info and latency fault tolerance
- **Auto topic creation**
  - Messages may be sent to the default topic (`TBW102`) if enabled
  - Can lead to uneven load; not recommended in production
- **Transactional messages**
  - First sent as _half messages_
  - Broker periodically checks transaction status
  - Commit → move to real topic
  - Rollback → discard

Transactional flow:

![RocketMQ Transaction Message](/posts/rockketmq-for-beginner/RocketMQ_T.png)

---

## Consumer

Consumers typically run in **cluster mode**.

### Rebalance Mechanism

- Rebalance runs periodically (default: 20s)
- Assigns message queues to consumers based on strategy:
  - Average
  - Consistent hash
  - Machine room awareness
- Adjusts local pull tasks when assignments change

Rebalance ensures **load balancing and fault tolerance** across consumer instances.

---

## Broker Server

### Core Modules

![RocketMQ Broker Modules](/posts/rockketmq-for-beginner/RocketMQ_B.png)

- Client Manager
- Store Service
- HA Service
- Index Service

### Message Storage

![RocketMQ Message Storage](/posts/rockketmq-for-beginner/RocketMQ_M.png)

- **CommitLog** – sequential storage of messages
- **ConsumeQueue** – logical index for fast consumption
- **IndexFile** – supports message lookup by key or time

ConsumeQueue and IndexFile are built asynchronously from CommitLog.

---

## Message Processing Flow

High-level message write flow:

1. Validate message and broker state
2. Build internal message representation
3. Handle transaction or delay logic
4. Append message to CommitLog (via memory-mapped files)
5. Flush to disk (sync or async)
6. Replicate to slave broker if enabled

This design balances **throughput, durability, and recoverability**.

---

## Summary

RocketMQ is a robust messaging system designed for complex, high-reliability business scenarios.

Key strengths:

- Rich messaging features
- Strong reliability guarantees
- Operational friendliness
- Java-native ecosystem

For systems where **message correctness matters more than raw throughput**, RocketMQ is an excellent choice.
