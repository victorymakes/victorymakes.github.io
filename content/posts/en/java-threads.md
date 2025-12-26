---
title: "Java Multithreading Explained: Concepts, Lifecycle, and Thread Pools"
description: A comprehensive guide to Java multithreading, covering thread fundamentals, lifecycle, synchronization, and thread pool design.
date: 2020-07-23
tags:
  - id: "threads"
    title: "Threads"
  - id: "interview"
    title: "Interview"
  - id: "java"
    title: "Java"
category:
  id: program
  title: Program
---

## Introduction

This article walks through **Java multithreading** from the ground up.
Each section focuses on a specific concept, explains the underlying principles,
and highlights common **interview questions** related to that topic.

Threads are one of the most important foundations of backend development.

<!-- more -->

---

## What Is a Thread?

A **thread** is the smallest unit of execution scheduled by the operating system.
It exists within a process, and multiple threads within the same process can execute concurrently.

Threads within the same process share:

- Virtual address space
- File descriptors
- OS signals

Each thread has its own:

- Call stack
- Register context
- Thread-local storage

### Why Use Multithreading?

- Better CPU utilization on multi-core systems
- Higher throughput
- Separation of I/O-bound and CPU-bound tasks
- Improved responsiveness

---

## Thread Lifecycle

Java defines six thread states in `Thread.State`:

- **NEW**: Thread created but not started
- **RUNNABLE**: Thread is executing or ready to execute
- **BLOCKED**: Waiting for a monitor lock
- **WAITING**: Waiting indefinitely for another thread
- **TIMED_WAITING**: Waiting for a fixed period
- **TERMINATED**: Execution completed

These states form the lifecycle of a thread.

---

## `wait()` vs `sleep()`

A very common interview question:

### Differences

| Aspect                   | `wait()`                   | `sleep()`  |
| ------------------------ | -------------------------- | ---------- |
| Class                    | `Object`                   | `Thread`   |
| Releases lock            | Yes                        | No         |
| Requires synchronization | Yes                        | No         |
| Wake-up                  | `notify()` / `notifyAll()` | Time-based |

---

## Waiting for Another Thread to Finish

If one thread needs to wait for another thread to complete:

- `Thread.join()`
- `CountDownLatch`
- `wait()` / `notify()`

`Thread.join()` is the simplest solution.

---

## Implementing a Blocking Queue (Classic Interview Question)

A simple blocking queue using `wait()` and `notifyAll()`:

```java
public class CustomBlockingQueue<T> {
    private final List<T> queue = new LinkedList<>();
    private final int limit;

    public CustomBlockingQueue(int limit) {
        this.limit = limit;
    }

    public synchronized void put(T item) throws InterruptedException {
        while (queue.size() == limit) {
            wait();
        }
        queue.add(item);
        notifyAll();
    }

    public synchronized T take() throws InterruptedException {
        while (queue.isEmpty()) {
            wait();
        }
        T item = queue.remove(0);
        notifyAll();
        return item;
    }
}
```

---

## Ways to Create Threads

### 1. Extending `Thread`

```java
class MyThread extends Thread {
    public void run() {
        // task logic
    }
}
```

### 2. Implementing `Runnable`

```java
class MyTask implements Runnable {
    public void run() {
        // task logic
    }
}
```

### 3. Implementing `Callable`

```java
class MyTask implements Callable<Integer> {
    public Integer call() {
        return 1;
    }
}
```

**Key differences:**

- `Runnable` returns no result
- `Callable` returns a value and can throw exceptions

---

## Thread Pools

Creating threads is expensive.
Java provides **thread pools** to manage thread lifecycle efficiently.

### Benefits

- Reduced resource consumption
- Improved performance
- Better thread management
- Prevents system overload

---

## `ThreadPoolExecutor` Core Parameters

| Parameter       | Description            |
| --------------- | ---------------------- |
| corePoolSize    | Number of core threads |
| maximumPoolSize | Maximum threads        |
| keepAliveTime   | Idle thread timeout    |
| workQueue       | Task queue             |
| threadFactory   | Thread creator         |
| handler         | Rejection policy       |

---

## Thread Creation Flow

ThreadPoolExecutor follows this logic:

1. If current threads < `corePoolSize`, create new thread
2. Else, enqueue task
3. If queue is full and threads < `maximumPoolSize`, create new thread
4. Else, reject task
5. Idle threads beyond `keepAliveTime` are terminated

---

## Rejection Policies

Built-in rejection strategies:

1. **AbortPolicy** – throws exception
2. **DiscardPolicy** – silently discards task
3. **DiscardOldestPolicy** – removes oldest queued task
4. **CallerRunsPolicy** – caller executes task

---

## Types of Thread Pools

Created via `Executors`:

- `newFixedThreadPool`
- `newCachedThreadPool`
- `newSingleThreadExecutor`
- `newWorkStealingPool`

Most create `ThreadPoolExecutor` instances;
`newWorkStealingPool` creates a `ForkJoinPool`.

---

## How to Choose Thread Pool Size

A commonly referenced formula:

```
Optimal threads =
(Waiting Time + CPU Time) / CPU Time × Number of CPU cores
```

This provides a starting point.
Final values should be tuned via **load testing**.

---

## Key Interview Questions Recap

1. What is a thread?
2. Why use multithreading?
3. Thread lifecycle
4. `wait()` vs `sleep()`
5. How to coordinate threads?
6. Thread creation methods
7. Thread pool benefits
8. ThreadPoolExecutor workflow
9. Rejection strategies
10. Thread pool sizing

---

## Conclusion

Java multithreading is not just about APIs—it’s about understanding
**execution models**, **resource management**, and **system behavior**.

Mastering these fundamentals helps you:

- Write safer concurrent code
- Debug production issues
- Perform well in technical interviews
