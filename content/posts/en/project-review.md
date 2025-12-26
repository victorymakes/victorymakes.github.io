---
title: "Project Retrospective: Lessons from a Real-World System"
description: A practical project retrospective covering system goals, technology choices, performance bottlenecks, and operational lessons.
date: 2019-06-06
tags:
  - id: "thinking"
    title: "Thinking"
category:
  id: program
  title: Program
---

## Why Do a Project Retrospective?

Reviewing and reflecting on past work is a valuable habit.
Whether it is a book you have read, an event you participated in, or a project you delivered,
retrospective thinking helps you gain deeper insight and avoid repeating mistakes.

A **project retrospective** allows you to:

- Understand why certain decisions were made
- Identify bottlenecks and shortcomings
- Extract reusable experience for future projects

Below is a simplified retrospective based on a real project I participated in.

<!-- more -->

---

## Key Questions

A project retrospective typically starts with a few core questions:

1. Why was this project initiated?
2. How were technology choices made?
3. What was the scale of the system?
4. What challenges were encountered, and how were they solved?
5. What could be improved in the future?

---

## Case Study Overview

This retrospective is based on an **insurance policy issuance system**
designed to serve internet partners with increasing transaction volume.

---

## Why the Project Was Built

As more internet partners integrated with the existing policy issuance system,
the original architecture could no longer handle the growing load.

To address this:

- Business logic was split by insurance type
- A dedicated internet-facing issuance system was built
- Faster response times for partners became the primary goal

---

## Technology Choices

### Core Stack

- **Spring Cloud**
  - Mature microservice ecosystem
  - Existing team experience
  - Proven internal success

- **MongoDB**
  - Suitable for document-based insurance policies
  - Horizontal scalability and high availability

- **RocketMQ**
  - Strong reliability guarantees
  - Rich messaging features
  - Easy horizontal scaling
  - Java-based implementation

### Why RocketMQ?

Compared to alternatives:

- **RabbitMQ**
  - Strong reliability but lower throughput
  - Suitable for reliability-first scenarios

- **Kafka**
  - Extremely high throughput
  - Potential message loss under failure
  - Ideal for data pipelines and logging

- **RocketMQ**
  - Balanced performance and reliability
  - Message replay and query capabilities
  - Better operational tooling

Given the business requirements, RocketMQ was the best fit.

---

## System Scale

- Peak QPS: ~10,000
- Daily transactions: ~600,000
- Historical total: ~60 million records

Deployment included multiple application servers, Redis clusters, and message brokers.

---

## Performance Bottlenecks and Troubleshooting

### Initial Symptom

Load testing showed that throughput was lower than expected,
despite CPU, memory, and IO not appearing to be saturated.

### Investigation Steps

1. Identify process IDs
2. Monitor CPU and memory usage
3. Inspect thread and heap information
4. Trace method-level execution using **Arthas**

Tracing revealed excessive latency in Redis operations.

---

## Root Cause

- Hot keys in Redis
- Overuse of Redis for frequently accessed data
- Inefficient serialization

---

## Solutions Implemented

1. Added local in-memory caching
2. Reduced cached data size
3. Replaced Jackson with Fastjson
4. Moved slow IO operations to asynchronous processing

These changes significantly improved throughput.

---

## Remaining Issues and Improvements

- Lack of gateway-level rate limiting
- JVM tuning for memory-heavy caching
- Cache consistency under high concurrency

### Potential Solutions

- API rate limiting per partner
- JVM memory tuning
- Improved cache update strategies
- Delayed cache invalidation or locking mechanisms

---

## Final Thoughts

Every project is an opportunity to learn.

The most important habit is **continuous reflection**—
not only after a project ends, but throughout its lifecycle.

Experience compounds when lessons are consciously captured and applied.
