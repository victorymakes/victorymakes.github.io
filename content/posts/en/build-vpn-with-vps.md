---
title: "From VPS to Secure Internet Access: A Practical Guide"
description: A step-by-step guide to purchasing a low-cost VPS and setting up secure internet access using SSR or V2Ray, with optional server optimizations.
date: 2019-08-27
tags:
  - id: "vps"
    title: "VPS"
  - id: "ssr"
    title: "SSR"
  - id: "v2ray"
    title: "V2Ray"
category:
  id: side-project
  title: Side Project
---

## Motivation

My Hong Kong Alibaba Cloud server recently expired, and I decided not to renew it—it had become too expensive.  
The cheapest configuration cost over 1,000 RMB per year, which didn’t make sense for my limited needs.

However, I still needed reliable and secure internet access.  
So I decided to rent a low-cost **VPS** and set it up myself.

My requirements were simple:

1. **Cheap** — as inexpensive as possible
2. **Unlimited bandwidth** — even if I don’t fully use it

---

## Choosing a VPS Provider

I searched for suitable VPS providers based on my requirements and found the following resources helpful:

1. Best overseas VPS providers (2019)
2. VPS under $10 recommendations
3. Curated lists of affordable VPS hosts

Eventually, I chose **BuyVM** and selected their cheapest VPS plan.

### VPS Configuration

- **$2 USD / month** (or **$18.68 USD / year**)
- Unlimited bandwidth
- 512 MB RAM
- 10 GB storage
- KVM virtualization
- 1 CPU core

This configuration is sufficient for lightweight services and secure internet access.

> Note: Network speed can be unstable at times, but it’s acceptable for the price.

<!-- more -->

---

## Purchasing the VPS

The purchasing process is straightforward, but keep the following points in mind:

1. Data centers are located in **Las Vegas**, **New York**, and **Luxembourg**
2. If paying via PayPal, ensure your PayPal email matches your BuyVM account email
3. Services may initially be in a **Pending** state—wait up to 2 hours or submit a ticket
4. **Check your email carefully** — all credentials and server details are sent via email
5. For any issues, submit a support ticket

### Setup Steps

1. Select VPS plan
   ![选择VPS](/posts/build-vpn-with-vps/select-vps.png)

2. Configure billing and duration
   ![Configure](/posts/build-vpn-with-vps/config-vps.png)

3. Complete payment
   ![payment](/posts/build-vpn-with-vps/pay-vps.png)

4. Confirm service is active
   ![Active](/posts/build-vpn-with-vps/check-vps.png)

5. Install CentOS via the control panel
   ![Install](/posts/build-vpn-with-vps/install-vps.png)

6. Connect to the server via SSH

---

## Setting Up Secure Access

Two popular solutions are commonly used:

- **ShadowsocksR (SSR)**
- **V2Ray**

You can choose either based on your preference.

### SSR

- Installation guide available online
- Supports multiple clients

### V2Ray

- Official installation guide available
- Default configuration works out of the box
- Highly flexible and extensible

---

## Optional: BBR Network Acceleration

### What Is BBR?

BBR is a TCP congestion control algorithm open-sourced by Google in 2016 and included in Linux kernel 4.9+.

In real-world testing, enabling BBR can significantly improve network throughput.

### Installing BBR

One-click installation script:

```bash
wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh
chmod +x bbr.sh
./bbr.sh
```

After reboot, verify kernel version:

```bash
uname -r
```

---

## Firewall Configuration

Never run a server without a firewall.

### Enable Firewall

```bash
systemctl start firewalld
```

### Open Required Ports

```bash
firewall-cmd --zone=public --add-port=14361/tcp --permanent
firewall-cmd --zone=public --add-port=80/tcp --permanent
firewall-cmd --zone=public --add-port=443/tcp --permanent
```

### Reload and Verify

```bash
firewall-cmd --reload
firewall-cmd --zone=public --list-ports
```

---

## Docker-Based Utilities (Optional)

For convenience, you can use a prebuilt toolkit:

- **docker-utils**: https://github.com/victorymakes/docker-utils

This repository provides Docker-based services that can be started quickly with minimal configuration.

---

## Summary

Using a low-cost VPS, you can quickly set up secure internet access and lightweight services.

Key takeaways:

- Affordable VPS providers are sufficient for personal use
- V2Ray offers flexibility and strong encryption
- BBR can significantly improve network performance
- Always configure a firewall

This setup provides a cost-effective and reliable solution without relying on expensive cloud servers.
