---
title: "A Programmer’s Side Project: Building a WeChat Mini Program"
description: A real-world account of building and launching a WeChat Mini Program as a side project, including preparation, development, monetization, and pitfalls.
date: 2021-06-04
tags:
  - id: "wechat"
    title: "Wechat"
category:
  id: side-project
  title: Side Project
---

## Preparation & Development

Every working professional dreams of building a side project that generates passive income.

I had known about the **Taobao affiliate** model for a long time,
but procrastination and the difficulty of promotion kept me from trying.
With more free time recently, I finally decided to give it a serious attempt.

### What I Prepared

- **Become a Taobao affiliate**
  - Apply via the [Taobao Open Platform](https://aff-open.taobao.com/developer/index.htm)
  - Affiliates have three levels (low / mid / high), each with different commission rates
  - Some people pay for promotion to reach higher levels faster

- **Server**
  - I chose Tencent Cloud to take advantage of new-user discounts
  - Three years for around 300 RMB—very cost-effective

- **Business license**
  - Required for WeChat Pay integration
  - Individual business licenses are sufficient
  - In cities like Shenzhen, the entire process can be completed online
  - Avoid paid “agents”—DIY is simple and cheaper

- **WeChat Official Account & Mini Program**
  - Apply via the [WeChat Open Platform](https://mp.weixin.qq.com/wxamp/index/index)

### Tech Stack

- [Vant Weapp](https://vant-contrib.gitee.io/vant-weapp/#/home)
- Spring Boot
- Spring Data JPA
- MySQL

<!-- more -->

---

## Launch

After a period of development, my mini program **“笔笔省”** went live.
Search for **“笔笔省”** in WeChat to find it.

The app helps users save money through coupons and cashback when shopping,
ordering food, buying groceries, or purchasing movie tickets.

I also created a supporting **WeChat Official Account** with the same name.

### Monetization Model

- **Taobao affiliate**
  - Query discounts and cashback via product links or promo codes

- **CPS partnerships**
  - Food delivery coupons (Meituan / Ele.me)
  - Grocery discounts
  - Discounted mobile top-ups
  - Discounted movie tickets
  - Restaurant and travel deals

### User Features

- View cashback order history
- Withdraw earnings

---

## What’s Missing

- Lack of proprietary core features
- Limited user engagement mechanisms
- No admin backend

The product is still evolving, and direction is being adjusted.

A discussion group was created for feedback:

![Discussion Group QR Code](/posts/side-project-of-programmer/qrcode.png)

Promotional poster:

![Promotional Poster](/posts/side-project-of-programmer/poster.png)

---

## Pitfalls & Lessons Learned

- **WeChat verification order matters**
  - Always verify the Official Account first
  - Otherwise, you may need to pay verification fees multiple times

- **Business license**
  - Handle it yourself—it’s easier than it looks

- **WeChat Pay feature eligibility**
  - Requires 90+ days since creation and recent transactions
  - Apply early to avoid launch delays

- **Taobao API permissions**
  - Advanced APIs are restricted for new accounts
  - Third-party services may be required (often paid)

- **Order attribution**
  - Mapping Taobao orders to users is tricky
  - Membership systems help but are hard to promote
  - PID-based solutions are another option

- **Promotion is hard**
  - Building something no one uses is emotionally tough
  - Distribution matters as much as development

---

## Final Thoughts

Side projects are not just about making money.
They teach product thinking, operations, and persistence.

Building is the easy part—**getting users is the real challenge**.
