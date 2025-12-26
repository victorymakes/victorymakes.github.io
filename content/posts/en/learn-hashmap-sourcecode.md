---
title: "HashMap Source Code Analysis: Capacity, Load Factor, and Resize"
description: A deep dive into the JDK 7 HashMap implementation, explaining capacity calculation, load factor, and resize behavior.
date: 2017-06-09
tags:
  - id: "hashmap"
    title: "HashMap"
  - id: "java"
    title: "Java"
  - id: "interview"
    title: "Interview"
category:
  id: program
  title: Program
---

## Introduction

I had previously read through the `HashMap` source code and felt I understood its implementation reasonably well.
At the time, the goal was mostly to handle interview questions, so the reading wasn’t very thorough.

Recently, however, someone asked me a question that I couldn’t answer confidently:

> **If you know you will store 1,000 entries in a HashMap, what should the initial capacity be?**

I vaguely remembered that resizing was involved, but couldn’t recall the exact details.
This prompted me to revisit the `HashMap` source code in depth.

> **Note:** This analysis is based on **JDK 7**.

<!-- more -->

---

## HashMap Internal Structure

At a high level, `HashMap` uses a combination of:

- **Array**
- **Linked list**

The array size is called the **capacity** (default is 16).
When inserting data:

1. The key is hashed
2. The hash is mapped to an array index using modulo
3. The entry is stored in the corresponding bucket

### Two Key Problems

1. **Hash collisions**  
   Multiple keys may map to the same index.

   **Solution:**  
   HashMap stores colliding entries as a linked list and compares keys for equality.

2. **Insufficient capacity**  
   When too many entries are stored, performance degrades.

   This is where **load factor** and **resizing** come into play.

---

## Constructors

Let’s start by examining the constructor:

```java
public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " + initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " + loadFactor);

    this.loadFactor = loadFactor;
    threshold = initialCapacity;
    init();
}
```

Two parameters significantly affect HashMap behavior:

- **initialCapacity**: initial array size (default: 16)
- **loadFactor**: threshold for resizing (default: 0.75)

### What Do These Mean?

If you create a HashMap with default settings:

- capacity = 16
- loadFactor = 0.75

The resize threshold is:

```
16 × 0.75 = 12
```

When the 13th entry is added, the HashMap resizes and doubles its capacity.

Resizing involves **rehashing and copying entries**, which is expensive.
Therefore, if the expected size is known, setting an appropriate initial capacity is strongly recommended.

---

## Load Factor Trade-offs

- **Higher load factor**
  - Uses less memory
  - Increases collision probability
  - Slower lookups

- **Lower load factor**
  - Uses more memory
  - Fewer collisions
  - Faster lookups

The default value `0.75` is a well-balanced trade-off between time and space.

---

## `put()` Operation Flow

Here is a simplified explanation of the `put()` process:

```java
public V put(K key, V value) {
    if (table == EMPTY_TABLE) {
        inflateTable(threshold);
    }

    if (key == null)
        return putForNullKey(value);

    int hash = hash(key);
    int index = indexFor(hash, table.length);

    for (Entry<K,V> e = table[index]; e != null; e = e.next) {
        if (e.hash == hash && key.equals(e.key)) {
            V oldValue = e.value;
            e.value = value;
            return oldValue;
        }
    }

    addEntry(hash, key, value, index);
    return null;
}
```

### Resize Logic

```java
if ((size >= threshold) && (table[bucketIndex] != null)) {
    resize(2 * table.length);
}
```

### Resize Process

1. Create a new array with double capacity
2. Recalculate hash positions
3. Reinsert all entries

---

## Solving the Original Question

If you want to store **1,000 entries**, and the default load factor is `0.75`:

```
Required capacity ≈ 1000 / 0.75 ≈ 1334
```

Since HashMap capacity must be a power of two, the nearest value is:

```
2048
```

Therefore:

```java
new HashMap<>(2048);
```

This avoids resizing and improves performance.

---

## Notes on JDK 8

In JDK 8, HashMap was optimized further:

- Buckets can convert from linked lists to **red-black trees**
- Improves lookup performance under heavy hash collisions

This article focuses on JDK 7, but the core concepts still apply.

---

## Conclusion

Understanding HashMap internals helps you:

- Write more efficient code
- Avoid unnecessary resizing
- Answer interview questions with confidence

HashMap is simple to use—but mastering its internals pays off.
