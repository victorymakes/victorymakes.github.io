---
title: Building a Java SDK for the WeChat Official Account Platform
description: A comparison of existing Java WeChat SDKs and the design and implementation of a custom WeChat Official Account SDK.
date: 2018-01-21
tags:
  - id: "java"
    title: "Java"
  - id: "wechat"
    title: "WeChat"
category:
  id: side-project
  title: Side Project
---

## Introduction

Recently, I worked on projects involving **WeChat Official Accounts** and **WeChat Third-Party Platforms**.
Although WeChat provides comprehensive HTTP-based APIs, it does **not** offer official SDKs for most programming languages.

This means developers must either:

- Directly call raw HTTP APIs, or
- Use (or build) a language-specific SDK

Since the WeChat Official Account platform has been around for years, there are already many Java-based SDK implementations.
However, after evaluating several popular options, none fully met my requirements.
As a result, I decided to build my own **Java WeChat SDK**.

This article compares existing SDKs and explains the motivation, design choices, and current progress of my own implementation.

<!-- more -->

---

## Choosing a Java WeChat SDK

A detailed comparison of popular Java WeChat SDKs already exists:
[Java WeChat SDK Comparison](https://my.oschina.net/ywbrj042/blog/402049)

Based on my own requirements, I summarized the comparison as follows:

| Feature                        | jfinal-weixin | weixin-java-tools | fastweixin | weixin-popular |
| ------------------------------ | ------------- | ----------------- | ---------- | -------------- |
| Simple implementation          | ✔             | ✘                 | ✔          | ✔              |
| Frequently updated             | ✔             | ✔                 | ✔          | ✔              |
| Entity abstractions            | ✘             | ✔                 | ✔          | ✔              |
| Minimal dependencies           | ✘             | ✘                 | ✔          | ✔              |
| Multi-account support          | ✔             | ✘                 | ✘          | ✔              |
| Code structure & extensibility | ✔             | ✔                 | ✔          | ✘              |

As shown above, **no existing SDK fully satisfied all requirements**.

The ideal SDK should be:

- Easy to extend
- Support multiple official accounts
- Have minimal dependencies
- Stay up-to-date with WeChat APIs
- Provide a clean and maintainable structure

Given this gap, I chose to implement my own SDK.

---

## Implementing a Custom WeChat SDK

Currently, the SDK covers most core WeChat Official Account APIs, organized according to the official documentation.

### Implemented Features

- Custom menus ✔
- Message management ✔
- Web authorization (OAuth) ✔
- Media management ✔
- Article comment management ✔
- User management ✔
- Account management ✔
- Data analytics ✔
- New customer service APIs ✔
- WeChat Third-Party Platform ✔
- WeChat Cards ✔
- WeChat Stores ✔

### Unimplemented Features

- WeChat Shop ✘
- Semantic understanding ✘
- Device APIs ✘
- Shake-around ✘
- Wi-Fi ✘
- QR scanning ✘
- Invoice APIs ✘

---

## Project Dependencies

The SDK is intentionally lightweight.

- **Jackson** (optional): default JSON serialization (customizable)
- **SLF4J**: logging
- **Apache HttpComponents** (optional): default HTTP client (customizable)
- **JUnit**: testing

In addition to API wrappers, the SDK provides extensibility interfaces for:

- Message deduplication
- Token caching
- Message push handling
- Message handler management

Default implementations are provided but can be replaced as needed.

---

## Using the WeChat SDK

### Maven Dependency

```xml
<dependency>
  <groupId>com.github.victorymakes</groupId>
  <artifactId>wechat-sdk</artifactId>
  <version>1.1.0</version>
</dependency>
```

### Example Usage

```java
// User tag APIs
@Test
public void testUserTags() {
    TagsResponse tags = UserApi.getTags(TOKEN);
    assertTrue(tags.isSuccess());

    if (!tags.getTags().isEmpty()) {
        Integer tagId = tags.getTags().get(0).getId();

        BaseResponse r1 = UserApi.batchTagUsers(TOKEN, Arrays.asList(OPENID), tagId);
        assertTrue(r1.isSuccess());

        FollowResponse r2 = UserApi.getTagUserIds(TOKEN, tagId, null);
        assertTrue(r2.isSuccess());

        BaseResponse r3 = UserApi.batchUnTagUsers(TOKEN, Arrays.asList(OPENID), tagId);
        assertTrue(r3.isSuccess());
    }
}

// Menu APIs
@Test
public void testCreateMenu() {
    Button click = new Button("click", "Today’s Music", "V1001_TODAY_MUSIC");
    Button view = new Button("view", "Search", "http://www.soso.com/");

    MenuButtons menu = new MenuButtons(Arrays.asList(click, view));
    BaseResponse response = MenuApi.create(TOKEN, menu);

    assertTrue(response.isSuccess());
}
```

More examples can be found in the project’s unit tests.

---

## Project Repository

**GitHub:**  
https://github.com/victorymakes/wechat-sdk

---

## Changelog

### 2018-02-28

- Added WeChat Store APIs
- Added WeChat Card APIs

### 2018-03-11

- Added Mini Program management for Third-Party Platforms
- Supported domain, member, login, and base info management

### 2018-03-24

- Added Mini Program code and template management
- Released **version 1.1.0**
- Improved Third-Party Platform APIs

### Planned

- Card strong authorization
- WeChat Ads APIs
- Additional Official Account features

---

## Conclusion

Building a custom WeChat SDK provided full control over structure, dependencies, and extensibility.
While existing SDKs work for many use cases, a tailored solution can be more suitable for complex or multi-account scenarios.
