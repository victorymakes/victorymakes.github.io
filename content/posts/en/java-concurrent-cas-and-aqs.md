---
title: "Java Concurrency Fundamentals: CAS and AQS Explained"
description: An in-depth explanation of CAS (Compare-And-Swap) and AQS (AbstractQueuedSynchronizer), the foundation of Java concurrent programming.
date: 2017-06-06
tags:
  - id: "java"
    title: "Java"
  - id: "concurrent"
    title: "Concurrent"
  - id: "aqs"
    title: "AQS"
  - id: "cas"
    title: "CAS"
  - id: "interview"
    title: "Interview"
category:
  id: program
  title: Program
---

## Introduction

When talking about **Java concurrency**, two core concepts inevitably come up:

- **CAS (Compare-And-Swap)**
- **AQS (AbstractQueuedSynchronizer)**

These mechanisms form the foundation of most classes in the `java.util.concurrent` (JUC) package.

<!-- more -->

---

## CAS (Compare-And-Swap)

### What Is CAS?

**CAS** is an optimistic concurrency mechanism designed to avoid the performance overhead of locks.

It operates on three values:

- **V**: the memory location
- **A**: the expected old value
- **B**: the new value

The operation can be described as:

> _If the value at V equals A, update it to B; otherwise, do nothing and return the current value._

In Java, CAS is implemented via low-level atomic instructions provided by `sun.misc.Unsafe`.
Most atomic classes in `java.util.concurrent.atomic` are built on top of CAS.

---

### Typical CAS Usage

The `AtomicInteger` class is a classic example:

```java
public class AtomicInteger extends Number implements Serializable {

    private static final Unsafe unsafe = Unsafe.getUnsafe();
    private volatile int value;

    public AtomicInteger(int initialValue) {
        value = initialValue;
    }

    public final int get() {
        return value;
    }

    public final int getAndIncrement() {
        for (;;) {
            int current = get();
            int next = current + 1;
            if (compareAndSet(current, next))
                return current;
        }
    }

    public final boolean compareAndSet(int expect, int update) {
        return unsafe.compareAndSwapInt(this, valueOffset, expect, update);
    }
}
```

CAS behaves like an **optimistic lock**:

- Fast under low contention
- May spin repeatedly under heavy contention

---

### CAS vs `synchronized`

Consider a simple counter:

```java
public class Counter {
    private int count;
    public synchronized void increase() {
        count++;
    }
}
```

Using CAS instead:

```java
public class Counter {
    private AtomicInteger count = new AtomicInteger();
    public void increase() {
        count.getAndIncrement();
    }
}
```

**Key differences:**

- CAS avoids blocking
- `synchronized` uses pessimistic locking
- CAS generally performs better under moderate contention

---

## AQS (AbstractQueuedSynchronizer)

### What Is AQS?

**AQS** is a framework provided by the JDK to build locks and synchronizers based on a **FIFO wait queue**.

It manages a single integer **state**, which represents synchronization state.

Many JUC classes are built on AQS, including:

- `ReentrantLock`
- `CountDownLatch`
- `Semaphore`
- `FutureTask`

---

### How AQS Works

To build a synchronizer using AQS, you override some of the following methods:

- `tryAcquire`
- `tryRelease`
- `tryAcquireShared`
- `tryReleaseShared`
- `isHeldExclusively`

State transitions are managed via:

- `getState()`
- `setState()`
- `compareAndSetState()`

---

### Example: CountDownLatch

`CountDownLatch` is a classic AQS-based synchronizer.

- State represents the counter
- `countDown()` releases shared state
- `await()` blocks until state reaches zero

Simplified core logic:

```java
protected int tryAcquireShared(int acquires) {
    return (getState() == 0) ? 1 : -1;
}

protected boolean tryReleaseShared(int releases) {
    for (;;) {
        int c = getState();
        if (c == 0) return false;
        int next = c - 1;
        if (compareAndSetState(c, next))
            return next == 0;
    }
}
```

---

## CAS and AQS Together

- **CAS** provides low-level atomicity
- **AQS** provides high-level coordination

Together, they enable:

- High-performance locks
- Scalable synchronizers
- Fine-grained concurrency control

---

## Key Takeaways

- CAS is the foundation of non-blocking algorithms
- AQS is the foundation of Java synchronizers
- Most concurrency utilities build on these two concepts
- Mastering CAS and AQS is essential for advanced Java concurrency

---

## Conclusion

Understanding CAS and AQS gives you deep insight into how Java concurrency really works.

Rather than memorizing APIs, learning these primitives allows you to:

- Reason about performance
- Debug concurrency issues
- Design better concurrent systems
