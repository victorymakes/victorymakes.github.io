---
title: "OTA Industry Knowledge: Key Concepts and Booking Flow"
description: An overview of essential OTA (Online Travel Agency) concepts, systems, and booking workflows used in the travel industry.
date: 2019-07-10
tags:
  - id: "ota"
    title: "OTA"
category:
  id: program
  title: Program
---

## Glossary

### OTA

**Online Travel Agency** — platforms where travelers book flights, hotels, car rentals, and travel services online.

---

### LCC

**Low-Cost Carrier** — budget airlines that offer lower fares by reducing service complexity.  
Examples: Ryanair, AirAsia, easyJet.

---

### PNR

**Passenger Name Record** — a record in an airline reservation system that contains itinerary, passenger details, and ticketing information.

---

### GDS

**Global Distribution System** — large-scale systems that aggregate travel inventory from airlines, hotels, and car rental companies and distribute it to travel agencies worldwide.

Major GDS providers:

- **1A** – Amadeus
- **1B** – Sabre / Abacus
- **1E** – TravelSky
- **1G** – Galileo

---

### CRS

**Computer Reservation System** — systems used by agents to search availability, create bookings, and manage reservations.

---

### ICS

**Inventory Control System** — airline-internal systems managing flight schedules, seat inventory, pricing, and revenue management.

---

### DCS

**Departure Control System** — airport systems handling check-in, boarding, load control, and flight departure operations.

---

### PCC / OID

**Pseudo City Code (PCC)** / **Office ID (OID)** — identifiers assigned to agencies or corporate users in GDS systems.  
Example: `AMSX1234P`

---

### IATA

**International Air Transport Association** — the global trade association for airlines, setting standards and policies.

---

### PTC

**Passenger Type Code** — codes defining passenger categories:

- **ADT** – Adult
- **CHD** – Child
- **INF** – Infant without a seat
- **INS** – Infant with a seat
- **UNN** – Unaccompanied minor

---

### PTL

**Payment Time Limit** — the deadline by which payment must be completed.

---

### TTL

**Ticketing Time Limit** — the deadline by which tickets must be issued.

---

### Look-to-Book Ratio (L2B)

The ratio of search requests to completed bookings, commonly used to measure demand efficiency and pricing performance.

---

### TST

**Transitional Stored Ticket** — a record containing fare, tax, and pricing details associated with a PNR.

---

### ATPCO

**Airline Tariff Publishing Company** — provides fare and rule data to airlines, GDSs, and travel technology providers.

---

### NDC

**New Distribution Capability** — an IATA XML-based standard that modernizes airline distribution, enabling richer content and personalized offers.

---

### CSD

**Consignment Security Declaration** — provides an audit trail of cargo security across the supply chain.

---

## Core Booking Flow

A typical OTA booking funnel follows this sequence:

1. **Search** – user searches flights or travel products
2. **Pricing** – fares and availability are priced in real time
3. **Selection** – user selects itinerary and options
4. **Booking** – PNR is created
5. **Payment** – payment is completed before PTL
6. **Ticketing** – tickets are issued before TTL
7. **Post-booking** – changes, cancellations, ancillaries

This funnel is critical for conversion optimization and system performance tuning.

---

## Summary

Understanding OTA terminology and workflows is essential for building, integrating, or optimizing travel systems.

Key takeaways:

- OTA systems integrate deeply with airline and GDS infrastructure
- Time limits (PTL / TTL) are critical business constraints
- Metrics like L2B directly impact pricing and capacity strategies

This knowledge forms the foundation of any travel technology platform.
