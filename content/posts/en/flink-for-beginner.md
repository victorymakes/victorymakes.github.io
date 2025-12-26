---
title: "Apache Flink for Beginners: Architecture, Concepts, and Stream Processing"
description: A comprehensive introduction to Apache Flink, covering big data architectures, stream processing fundamentals, and Flink’s core features.
date: 2019-06-08
tags:
  - id: "flink"
    title: "Flink"
  - id: "big-data"
    title: "Big Data"
  - id: "middleware"
    title: "Middleware"
category:
  id: program
  title: Program
---

## Big Data Application Scenarios

Is big data a recent invention?  
Have people only recently discovered its value?

Not really.

Decades ago, mathematical analysis was already being applied in the financial industry to build predictive models.
Today, with the rise of the internet, massive amounts of data are generated every second, including:

- User browsing and search behavior
- Travel and mobility data
- Purchase and payment records
- Agricultural growth monitoring
- Medical and healthcare data

These data sources drive value across industries.

Typical application scenarios include:

1. Healthcare analytics for faster diagnosis
2. E-commerce personalization and precision marketing
3. Retail customer profiling and recommendations
4. Financial modeling and stock prediction
5. Smart transportation and traffic optimization

<!-- more -->

---

## Big Data Processing Architectures

Handling massive data volumes requires computers, not manual processing.
Just like microservices in traditional web systems, big data systems rely on distributed architectures.

Key requirements of a big data architecture include:

1. Fault tolerance and resilience
2. Low latency
3. Horizontal scalability
4. Extensibility
5. Efficient querying
6. Ease of maintenance

Two classic architectural models dominate big data system design:

- **Lambda Architecture**
- **Kappa Architecture**

These are architectural philosophies rather than concrete products.

---

## Lambda Architecture

Lambda Architecture, proposed by Nathan Marz, divides data processing into three layers:

- **Batch Layer**  
  Processes large volumes of historical data using distributed systems like Hadoop.
  Suitable for offline computation.

- **Speed Layer**  
  Processes real-time incremental data using stream processing frameworks such as Storm, Spark Streaming, or Flink.

- **Serving Layer**  
  Merges batch and real-time views to serve query results.

### Pros

- Supports both real-time and batch processing
- Balances latency and accuracy

### Cons

- Requires maintaining two codebases
- Batch processing may not complete within required time windows
- Potential inconsistencies between batch and real-time results

---

## Kappa Architecture

Kappa Architecture simplifies Lambda Architecture by removing the batch layer.

Core principles:

1. Persist historical data (e.g., Kafka)
2. Reprocess data via stream processing when needed
3. Replace old processing results with new ones

### Lambda vs Kappa

| Aspect          | Lambda    | Kappa   |
| --------------- | --------- | ------- |
| Historical data | Excellent | Limited |
| Resource cost   | High      | Lower   |
| Complexity      | High      | Lower   |
| Operations      | Complex   | Simpler |

---

## Why Apache Flink

Popular stream processing frameworks include:

- Storm
- Spark Streaming
- Flink

Flink stands out due to:

- True stream processing (not micro-batching)
- Low latency and high throughput
- Exactly-once semantics
- Stateful computation
- Event-time processing

---

## What Is Apache Flink

Apache Flink is an open-source distributed stream processing framework developed by the Apache Software Foundation.

Key features:

- Unified batch and stream processing
- Event-time semantics and watermarks
- Fault tolerance with exactly-once guarantees
- Rich connector ecosystem (Kafka, HDFS, Elasticsearch, Cassandra)

---

## Flink Architecture

Flink clusters consist of two main process types:

- **JobManager**  
  Coordinates job scheduling, resource management, and checkpoints.

- **TaskManager**  
  Executes tasks and manages task slots.

A running Flink cluster contains at least one JobManager and one TaskManager.

---

## Programming Model

Flink programs follow a dataflow model:

```
Source → Transformations → Sink
```

The dataflow forms a directed acyclic graph (DAG).

Common transformations include:

- Map
- Filter
- KeyBy
- Window

---

## Time Semantics in Flink

Flink supports three notions of time:

- **Event Time**: when the event actually occurred
- **Processing Time**: when the event is processed
- **Ingestion Time**: when the event enters the system

Event time is crucial for correctness and reproducibility.

---

## Windows

Flink supports multiple window types:

### Time Windows

- Tumbling windows
- Sliding windows

```java
stream.timeWindow(Time.minutes(1));
stream.timeWindow(Time.minutes(60), Time.minutes(1));
```

### Count Windows

```java
stream.countWindow(100);
stream.countWindow(100, 10);
```

### Session Windows

```java
stream.window(SessionWindows.withGap(Time.minutes(5)));
```

---

## Watermarks

Watermarks track progress in event time.

A watermark with timestamp `t` indicates that no events with timestamps ≤ `t` are expected.

This mechanism enables correct window closure and late event handling.

---

## Stateful Processing and Exactly-Once

Stateful stream processing introduces correctness challenges.

Flink supports **exactly-once semantics** through:

- Checkpoints (automatic)
- Savepoints (manual)

### State Backends

- MemoryStateBackend
- FsStateBackend
- RocksDBStateBackend

---

## Conclusion

Apache Flink is a powerful stream processing engine suitable for both Lambda and Kappa architectures.

Its strengths in low latency, high throughput, event-time processing, and fault tolerance make it an excellent choice
for building modern, real-time data platforms.
