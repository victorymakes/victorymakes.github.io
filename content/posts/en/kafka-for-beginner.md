---
title: "Kafka Overview: Architecture, Components, and Internals"
description: An overview of Apache Kafka, covering its architecture, core components, and internal mechanisms based on Kafka 2.4.
date: 2019-12-19
tags:
  - id: "kafka"
    title: "Kafka"
  - id: "java"
    title: "Java"
  - id: "big-data"
    title: "Big Data"
category:
  id: program
  title: Program
---

## Introduction

[Apache Kafka](http://kafka.apachecn.org/intro.html) is a **distributed streaming platform**.
It can be used both as a traditional **message broker** for publish–subscribe systems and as a
**stream storage and processing system** for large-scale data pipelines.

Thanks to its distributed design, Kafka provides:

- High throughput
- Fault tolerance
- Horizontal scalability

Typical use cases include:

- Event-driven business systems
- Log aggregation
- Stream processing with big data frameworks (e.g., Kafka + Samza)

This article explains Kafka’s core concepts and internal mechanisms based on **Kafka 2.4**.

<!-- more -->

---

## Core Components

From a physical deployment perspective, Kafka consists of the following modules:

1. **ZooKeeper**  
   Stores metadata and provides event notifications.

2. **Broker**  
   The core Kafka server (implemented in Scala), responsible for handling client requests
   and persisting message data.

3. **Clients (Producers & Consumers)**  
   Implemented in Java, responsible for producing and consuming messages.

---

## Key Concepts

- Broker
- Producer
- Consumer
- Controller
- GroupCoordinator
- TransactionCoordinator
- Topic
- Partition
- Replica

---

## ZooKeeper

[Apache ZooKeeper](https://zookeeper.apache.org/) acts as Kafka’s metadata store and coordination service.

It stores information such as:

### Cluster Metadata

- `/cluster/id`

```json
{
  "version": 4,
  "id": 1
}
```

### Controller Metadata

- `/controller`

```json
{
  "version": 4,
  "brokerId": 1,
  "timestamp": "2233345666"
}
```

- `/controller_epoch`

### Broker Metadata

- `/brokers/ids/{id}`

```json
{
  "version": 4,
  "host": "localhost",
  "port": 9092,
  "jmx_port": 9999,
  "endpoints": ["CLIENT://host1:9092", "REPLICATION://host1:9093"],
  "rack": "dc1"
}
```

- `/brokers/seqid` (used to generate broker IDs)

### Topic & Partition Metadata

- `/brokers/topics/{topic}`
- `/brokers/topics/{topic}/partitions/{partition}/state`

### Consumer Metadata (legacy)

- `/consumers/{group}/offsets/{topic}/{partition}`

---

## Broker Startup Process

When a Kafka broker starts, it performs the following steps:

1. Initialize ZooKeeper client and create root nodes
2. Create or retrieve the Cluster ID
3. Load local broker metadata
4. Generate or read broker ID
5. Start the Replica Manager and related background tasks
6. Register broker information in ZooKeeper
7. Start the **Controller election**
8. Initialize GroupCoordinator
9. Initialize TransactionCoordinator
10. Start request handling services

Only one broker in the cluster becomes the **Controller**, responsible for:

- Broker lifecycle events
- Leader election
- Topic creation and deletion
- Partition reassignment

---

## Producer

### Example

```java
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("acks", "all");
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

Producer<String, String> producer = new KafkaProducer<>(props);
producer.send(new ProducerRecord<>("my-topic", "key", "value"));
producer.close();
```

### Key Characteristics

- Thread-safe
- Uses internal buffers for batching
- Supports retries and acknowledgements
- `acks` determines durability guarantees

---

## Consumer

### Example

```java
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("group.id", "test");
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
consumer.subscribe(Arrays.asList("my-topic"));

while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
    for (ConsumerRecord<String, String> record : records) {
        System.out.println(record.value());
    }
}
```

### Key Characteristics

- Not thread-safe
- Supports consumer groups
- Automatic or manual offset management
- Rebalancing on membership changes

---

## Summary

Kafka is a powerful and flexible platform for both messaging and stream processing.

Key takeaways:

- Distributed by design
- High throughput and fault tolerance
- Strong ecosystem for stream processing
- Requires understanding of internals for effective use

---

For deeper understanding, consider reading Kafka’s source code and official documentation.
