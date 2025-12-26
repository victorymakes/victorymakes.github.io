---
title: "Lock vs Synchronized in Java: When and Why to Use Each"
description: A detailed comparison of Java's synchronized keyword and the Lock API, explaining their differences, use cases, and best practices.
date: 2017-05-30
tags:
  - id: "java"
    title: "Java"
  - id: "threads"
    title: "Threads"
  - id: "interview"
    title: "Interview"
category:
  id: program
  title: Program
---

## Introduction

In Java multithreaded programming, ensuring thread safety often involves using
`synchronized` or the `Lock` API.

A common interview question is:

> **When should you use `synchronized`, and when should you use `Lock`?**

To answer this correctly, we need a clear understanding of how both mechanisms work
and what trade-offs they involve.

<!-- more -->

---

## `synchronized`

`synchronized` is Java’s built-in locking mechanism that enforces **mutual exclusion**
and **memory visibility**.

Each `synchronized` construct has two parts:

1. A reference to the lock object
   - For synchronized methods, the lock is the current object (`this`)
2. A block of code protected by the lock

Every Java object can act as a lock. These built-in locks are also known as
**intrinsic locks** or **monitor locks**.

### Usage Examples

```java
// Method-level synchronization
public synchronized void synchronizedMethod() {
    // critical section
}

// Block-level synchronization
synchronized (lockObject) {
    // critical section
}
```

### Characteristics of `synchronized`

- Implicit lock acquisition and release
- Lock is released automatically when exiting the block or when an exception occurs
- Only one thread can hold the lock at a time (mutual exclusion)
- Simple and safe to use

---

## `Lock` Interface

The `Lock` interface provides a more **flexible and expressive** locking mechanism
compared to `synchronized`.

Its key feature is that **lock acquisition and release are explicit**, giving developers
more control.

### Core Methods

```java
public interface Lock {
    void lock();
    void lockInterruptibly() throws InterruptedException;
    boolean tryLock();
    boolean tryLock(long time, TimeUnit unit) throws InterruptedException;
    void unlock();
    Condition newCondition();
}
```

### Typical Usage Pattern

```java
Lock lock = new ReentrantLock();

lock.lock();
try {
    // critical section
} finally {
    lock.unlock();
}
```

Using `finally` is critical to avoid deadlocks caused by forgotten unlock calls.

---

## Key Differences: `Lock` vs `synchronized`

| Aspect              | synchronized | Lock                |
| ------------------- | ------------ | ------------------- |
| Lock management     | Automatic    | Manual              |
| Interruptible lock  | No           | Yes                 |
| Timed lock attempt  | No           | Yes                 |
| Try-lock            | No           | Yes                 |
| Fairness option     | No           | Yes (ReentrantLock) |
| Condition variables | wait/notify  | Condition           |
| Error-prone         | Low          | Higher if misused   |

---

## `ReentrantLock`

`ReentrantLock` is the most commonly used implementation of the `Lock` interface.

Features:

- Supports **fair** and **non-fair** locking (non-fair by default)
- Reentrant: the same thread can acquire the lock multiple times
- Built on top of **AQS (AbstractQueuedSynchronizer)**

Fair locks grant access in FIFO order, while non-fair locks prioritize throughput.

---

## Choosing Between `Lock` and `synchronized`

As a general rule:

> Prefer `synchronized` for simplicity and safety  
> Use `Lock` only when you need advanced features

### Use `Lock` when you need:

- Interruptible lock acquisition
- Timed lock attempts
- Fair locking
- Multiple condition queues
- Locking across non-structured blocks

Otherwise, `synchronized` is usually the better choice.

---

## Interview Tip

If asked:

> **What synchronization mechanisms does Java provide?**

A solid answer would be:

> Java provides built-in synchronization via `synchronized` and more advanced
> locking mechanisms through the `Lock` API, with `ReentrantLock` being the most
> commonly used implementation.

---

## Conclusion

Both `synchronized` and `Lock` solve the same core problem: **thread safety**.

The difference lies in **control vs simplicity**.

Understanding their internal behavior and trade-offs allows you to make informed
choices in both interviews and production systems.
