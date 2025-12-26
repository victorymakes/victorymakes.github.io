---
title: "Feign Basics: Building Elegant Java HTTP Clients"
description: A practical introduction to Feign, covering core concepts, usage patterns, and integrations for building clean Java HTTP clients.
date: 2017-06-23
tags:
  - id: "feign"
    title: "Feign"
  - id: "http"
    title: "Http"
  - id: "java"
    title: "Java"
category:
  id: program
  title: Program
---

## Introduction

[Feign](https://github.com/OpenFeign/feign) makes writing **Java HTTP clients** significantly easier.  
It was inspired by [Retrofit](https://github.com/square/retrofit), [JAX-RS 2.0](https://jax-rs-spec.java.net/nonav/2.0/apidocs/index.html), and [WebSocket](http://www.oracle.com/technetwork/articles/java/jsr356-1937161.html).

Feign was originally created to reduce the complexity of binding [Denominator](https://github.com/Netflix/Denominator) to HTTP APIs, regardless of whether the API follows REST conventions.

### Maven Dependency

```xml
<dependency>
    <groupId>com.netflix.feign</groupId>
    <artifactId>feign-core</artifactId>
    <version>8.18.0</version>
    <scope>runtime</scope>
</dependency>
```

---

## Why Choose Feign?

You can build Java clients using frameworks like **Jersey** or **CXF**, or directly with **Apache HttpClient**.  
However, Feign aims to minimize boilerplate and resource usage when connecting to HTTP APIs.

By leveraging customizable encoders, decoders, and error handling, Feign allows you to define clean, declarative clients for any text-based HTTP API.

---

## How Feign Works

Feign works by injecting a **templated request** through annotations.  
Before sending a request, Feign expands parameters directly into the template.

This design limits Feign to text-based APIs but significantly simplifies request/response handling and makes clients extremely easy to test.

<!-- more -->

---

## Basic Usage

Below is a simplified adaptation of the canonical Retrofit example:

```java
interface GitHub {

  @RequestLine("GET /repos/{owner}/{repo}/contributors")
  List<Contributor> contributors(
      @Param("owner") String owner,
      @Param("repo") String repo
  );
}

class Contributor {
  String login;
  int contributions;
}

public static void main(String[] args) {
  GitHub github = Feign.builder()
      .decoder(new GsonDecoder())
      .target(GitHub.class, "https://api.github.com");

  List<Contributor> contributors =
      github.contributors("OpenFeign", "feign");

  for (Contributor c : contributors) {
    System.out.println(c.login + " (" + c.contributions + ")");
  }
}
```

---

## Customization

Feign provides extensive customization options.  
For example, you can build a client with your own decoder:

```java
interface Bank {
  @RequestLine("POST /account/{id}")
  Account getAccountInfo(@Param("id") String id);
}

Bank bank = Feign.builder()
    .decoder(new AccountDecoder())
    .target(Bank.class, "https://api.examplebank.com");
```

---

## Multiple Targets

Feign supports multiple API targets through `Target<T>` implementations.

Example:

```java
CloudDNS cloudDNS =
    Feign.builder().target(
        new CloudIdentityTarget<CloudDNS>(user, apiKey)
    );
```

This pattern allows dynamic URL resolution and request decoration before execution.

---

## Examples

Feign provides official example implementations, including:

- GitHub client
- Wikipedia client

These examples demonstrate Feign usage in real-world scenarios.

---

## Feign Integrations

Feign integrates seamlessly with many popular libraries.

### Gson

Provides JSON encoding and decoding support.

```java
GitHub github = Feign.builder()
    .encoder(new GsonEncoder())
    .decoder(new GsonDecoder())
    .target(GitHub.class, "https://api.github.com");
```

### Jackson

Alternative JSON support using Jackson.

```java
GitHub github = Feign.builder()
    .encoder(new JacksonEncoder())
    .decoder(new JacksonDecoder())
    .target(GitHub.class, "https://api.github.com");
```

### SAX

Used for XML parsing with low memory overhead.

```java
Feign.builder()
    .decoder(SAXDecoder.builder()
        .registerContentHandler(UserIdHandler.class)
        .build())
    .target(Api.class, "https://apihost");
```

### JAXB

XML encoding and decoding support.

```java
Feign.builder()
    .encoder(new JAXBEncoder())
    .decoder(new JAXBDecoder())
    .target(Api.class, "https://apihost");
```

---

## JAX-RS Contract

Feign can use JAX-RS annotations instead of its default ones.

```java
interface GitHub {
  @GET
  @Path("/repos/{owner}/{repo}/contributors")
  List<Contributor> contributors(
      @PathParam("owner") String owner,
      @PathParam("repo") String repo
  );
}

GitHub github = Feign.builder()
    .contract(new JAXRSContract())
    .target(GitHub.class, "https://api.github.com");
```

---

## HTTP Clients

### OkHttp

Feign can use OkHttp for better performance and SPDY support.

```java
GitHub github = Feign.builder()
    .client(new OkHttpClient())
    .target(GitHub.class, "https://api.github.com");
```

### Ribbon

Provides client-side load balancing.

```java
MyService api =
    Feign.builder()
        .client(RibbonClient.create())
        .target(MyService.class, "https://myAppProd");
```

---

## Fault Tolerance with Hystrix

Feign integrates with Hystrix to support **circuit breaking**.

```java
MyService api =
    HystrixFeign.builder()
        .target(MyService.class, "https://myAppProd");
```

---

## Logging

Feign supports configurable logging.

```java
GitHub github = Feign.builder()
    .logger(new Logger.JavaLogger().appendToFile("logs/http.log"))
    .logLevel(Logger.Level.FULL)
    .target(GitHub.class, "https://api.github.com");
```

---

## Advanced Topics

### Request Interceptors

Modify all outgoing requests globally.

```java
class ForwardedForInterceptor implements RequestInterceptor {
  @Override
  public void apply(RequestTemplate template) {
    template.header("X-Forwarded-For", "origin.host.com");
  }
}
```

### Dynamic Query Parameters

```java
@RequestLine("GET /find")
V find(@QueryMap Map<String, Object> queryMap);
```

### Default Methods (Java 8+)

```java
interface GitHub {
  default List<Repo> repos(String owner) {
    return repos(owner, "full_name");
  }
}
```

---

## Summary

Feign provides a clean, declarative way to build HTTP clients in Java.

Key advantages:

- Minimal boilerplate
- Strong integration ecosystem
- Easy testing and maintenance
- Ideal for microservice architectures

For teams building service-to-service communication, Feign remains a powerful and elegant choice.
