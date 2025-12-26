---
title: "Performance Comparison: Spring MVC vs Spring WebFlux"
description: A performance comparison between Spring MVC and Spring WebFlux for IO-intensive workloads, based on real load testing results.
date: 2020-07-10
tags:
  - id: "reactor"
    title: "Reactor"
  - id: "springboot"
    title: "SpringBoot"
  - id: "webflux"
    title: "WebFlux"
category:
  id: program
  title: Program
---

## Preface

I recently worked on a small project whose main responsibility was:

- Accept internal requests
- Transform them
- Call external services
- Normalize external responses

In essence, this was a **lightweight gateway-style application**.
Business logic was minimal, while the workload was clearly **IO‑intensive** and external latency was unpredictable.

This made it a perfect candidate to explore **Spring WebFlux**, introduced in Spring 5 as part of the reactive stack.

![WebFlux Overview](/posts/spring-mvc-vs-spring-webflux-performance/springboot2.png)

<!-- more -->

---

## Spring WebFlux

Spring WebFlux is a fully non-blocking web framework built on **Reactive Streams**.
It runs on servers such as **Netty**, **Undertow**, or **Servlet 3.1+ containers**.

Key characteristics:

- Asynchronous, non-blocking I/O
- Uses fewer threads to handle high concurrency
- Scales with fewer hardware resources

---

## Spring MVC vs Spring WebFlux

### Spring MVC

- Built on the Servlet API
- Synchronous, blocking I/O model
- One request is bound to one thread
- Requires large thread pools under high concurrency

### Spring WebFlux

- Built on Reactive Streams adapters
- Asynchronous, non-blocking I/O model
- Uses a small, fixed-size event-loop thread pool

The conceptual difference:

![MVC vs WebFlux](/posts/spring-mvc-vs-spring-webflux-performance/spring-mvc-and-webflux-venn.png)

> WebFlux is **not** a replacement for Spring MVC.
> If Spring MVC already satisfies your requirements, switching to WebFlux is unnecessary and may increase complexity.

---

## When Should You Use WebFlux?

Official guidance suggests:

1. WebFlux does **not** yet support blocking drivers like traditional JDBC (e.g., MySQL)
2. WebFlux defaults to Netty
3. Prefer MVC when it is sufficient
4. Start small, test thoroughly, then expand usage

---

## Load Testing Setup

### Test Services

Three services were deployed in Docker with identical CPU and memory limits (1 GB):

- **web** – external service (Spring WebFlux)
- **mvc** – gateway using Spring MVC
- **flux** – gateway using Spring WebFlux

![Test Architecture](/posts/spring-mvc-vs-spring-webflux-performance/flux-vs-mvc.png)

---

## Test Endpoints

### External Service (web)

```java
@GetMapping("/hello/{times}")
public Mono<String> hello(@PathVariable int times) {
    return Mono.delay(Duration.ofMillis(times)).thenReturn("Hello");
}
```

### MVC Gateway

```java
@GetMapping("/block/{times}")
public String block(@PathVariable int times) {
    return restTemplate.getForObject(url + "/hello/" + times, String.class);
}
```

### WebFlux Gateway

```java
@GetMapping("/reactor/{times}")
public Mono<String> reactor(@PathVariable int times) {
    return Mono.just(times)
        .flatMap(t -> client.get()
            .uri(url + "/hello/" + times)
            .retrieve()
            .bodyToMono(String.class));
}
```

---

## Benchmark Results

### Latency: 10ms

**Throughput comparison:**

![Throughput 10ms](/posts/spring-mvc-vs-spring-webflux-performance/mvc-vs-flux-1000threads.png)

**Resource usage:**

- MVC

  ![MVC Monitor](/posts/spring-mvc-vs-spring-webflux-performance/mvc-monitor.png)

- WebFlux

  ![WebFlux Monitor](/posts/spring-mvc-vs-spring-webflux-performance/flux-monitor.png)

---

### Latency: 20ms

**Throughput comparison:**

![Throughput 20ms](/posts/spring-mvc-vs-spring-webflux-performance/mvc-vs-flux-1000threads-20ms.png)

---

## Conclusion

For **IO‑intensive workloads**:

- Throughput is similar between MVC and WebFlux
- WebFlux has **lower response times**
- WebFlux uses **fewer threads and less memory**
- The higher the latency, the more WebFlux’s advantages stand out

The full benchmark code is available here:
https://github.com/victorymakes/webfluxtest
