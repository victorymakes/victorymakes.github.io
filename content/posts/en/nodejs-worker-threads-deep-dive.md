---
title: A Deep Dive into Node.js Worker Threads
description: An in-depth explanation of Node.js worker threads, how they work internally, and how to use them efficiently for CPU-intensive workloads.
date: 2020-07-22
tags:
  - id: "nodejs"
    title: "Node.js"
  - id: "threads"
    title: "Threads"
category:
  id: program
  title: Program
---

## Introduction

Recently, I needed to work on a Node.js application again after several years away from the ecosystem.
At the same time, I was learning Go, whose lightweight concurrency model makes it easy to fully utilize
multi-core CPUs.

That contrast brought back a classic Node.js question:

> **How can Node.js efficiently utilize multiple CPU cores?**

Starting from **Node.js v10.5.0**, an experimental feature called **worker threads** was introduced to address
CPU-bound workloads. Since **Node.js v12 LTS**, the `worker_threads` module has become a stable feature.

This article is a translated and adapted version of:

> _Deep Dive into Worker Threads in Node.js_  
> https://blog.insiderattack.net/deep-dive-into-worker-threads-in-node-js-e75e10546b11

<!-- more -->

---

## A Brief History of CPU-Bound Work in Node.js

Before worker threads existed, developers had several options for handling CPU-intensive tasks in Node.js:

- Using the `child_process` module
- Using the `cluster` module
- Using third-party libraries such as **Napa.js**

However, none of these approaches gained widespread adoption due to:

- Performance overhead
- Operational complexity
- Learning curve
- Stability issues
- Poor documentation

Worker threads were introduced to provide a **first-class, lightweight concurrency model**.

---

## Executing CPU-Intensive Code with Worker Threads

Although JavaScript itself is single-threaded, worker threads allow Node.js applications to run
**multiple independent JavaScript workers**.

Each worker:

- Has its own V8 instance
- Has its own event loop
- Can communicate with the parent worker
- Can share memory (unlike child processes)

### Basic Example

```js
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: { num: 5 } });
  worker.once("message", (result) => {
    console.log("square of 5 is:", result);
  });
} else {
  parentPort.postMessage(workerData.num * workerData.num);
}
```

In this example, the main thread delegates a CPU task to a worker thread and receives the result asynchronously.

---

## How Worker Threads Work Internally

JavaScript does not provide native multithreading language features.
Node.js worker threads achieve parallelism using **V8 Isolates**.

### V8 Isolates

A **V8 Isolate** is an independent V8 runtime instance with:

- Its own JavaScript heap
- Its own microtask queue

This ensures isolation between workers but also means workers cannot directly access each other’s heaps.

Because of this isolation, **each worker also has its own libuv event loop**.

---

## Crossing the JavaScript / C++ Boundary

Worker creation and communication are implemented in C++.
The implementation can be found in:

https://github.com/nodejs/node/blob/master/src/node_worker.cc

From a JavaScript perspective, the worker system consists of:

1. **Worker initialization script**
   - Sets up communication channels
   - Passes metadata to the worker

2. **Worker execution script**
   - Runs the user-provided JavaScript code

---

## Message Channels

Communication between parent and child workers happens via **message channels**.

Each channel consists of two ports:

- `port1`
- `port2`

The parent and worker communicate by sending messages through these ports.

This design is similar to the Web MessageChannel API.

---

## Worker Lifecycle

### Initialization Phase

1. The parent thread creates a worker
2. Node.js creates a C++ worker instance
3. A unique thread ID is assigned
4. An initialization message channel (IMC) is created
5. A public message channel (PMC) is created
6. Metadata is sent to the worker through IMC

### Execution Phase

1. A new V8 isolate is created
2. libuv event loop is initialized
3. Worker initialization script runs
4. Worker execution script runs user code

This separation ensures clean isolation and predictable execution.

---

## Important Observations

You may notice that `workerData` and `parentPort` are only available inside
the **worker thread** itself.

Attempting to access them in the main thread returns `null`.

This is by design.

---

## Using Worker Threads Effectively

While worker threads are powerful, misuse can hurt performance.

### Best Practices

- Avoid creating workers frequently
- Use worker threads **only for CPU-bound tasks**
- Do not use worker threads for I/O-heavy workloads

---

## Worker Thread Pools

Creating worker threads repeatedly is expensive.

A **worker pool** allows tasks to be reused across a fixed set of workers,
significantly improving performance.

While Node.js does not provide a built-in worker pool, you can:

- Implement your own
- Use a third-party library

Proper pooling can drastically reduce overhead.

---

## Performance Comparison

The following scenarios illustrate performance differences:

1. Single-threaded execution
2. Worker threads without pooling
3. Worker threads with pooling

Worker threads with pooling consistently deliver the best performance
for CPU-intensive workloads.

---

## Conclusion

Worker threads enable Node.js to handle CPU-bound workloads efficiently
by leveraging multi-core CPUs.

Understanding their internals helps you:

- Design high-performance systems
- Avoid unnecessary overhead
- Choose the right concurrency model

Used correctly, worker threads significantly expand what Node.js can do.
