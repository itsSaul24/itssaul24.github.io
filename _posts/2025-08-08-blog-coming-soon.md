---
layout: post
title: "My First OMSCS Project - Man in the Middle"
date: 2025-08-27
published: true
author: Saul Means
tags: [omscs, cybersecurity, networking, cryptography, learning]
read_time: 5
excerpt: "Diving into my first OMSCS project in Intro to Information Security. Eight hours of network forensics, cryptography, and learning why preparation matters."
---

# My First OMSCS Project - Man in the Middle

I just finished my first project in the OMSCS program. CS6035 (Intro to Information Security) threw me straight into network forensics, and honestly, it was way more fun than I expected.

## The Setup

The project was about catching hackers by analyzing a pcap file. Think digital detective work - sifting through network traffic to find clues and piece together what happened.

I spent 8-10 hours total on this. But here's the thing - I was nervous about my first OMSCS project, so I spent a few days beforehand reviewing TCP, DNS, and IRC concepts. I'd never touched networking before, and this prep work saved me.

## What I Learned

### Network Fundamentals

Before this project, networking was a black box to me. Now I understand:

**TCP/DNS/IRC basics** - These protocols power most internet communication. TCP handles reliable data transfer, DNS translates domain names to IP addresses, and IRC manages chat communications.

**Direct Client Connections (DCCs)** - A way for IRC users to bypass the server and connect directly. This became important for finding hidden communications in the traffic.

**IP address formats** - Addresses aren't always in the familiar dotted notation. Sometimes they're stored as numeric values that need calculation to decode.

**Wireshark for packet analysis** - This GUI tool (built on TShark) lets you filter and examine network traffic. Learning to navigate thousands of packets and find the relevant ones was like learning a new language.

### Cryptography in Practice

The project had multiple layers of encryption. Tools like CyberChef became essential for decrypting messages and files. 

What surprised me was how much detective work goes into cryptography. Different encryption algorithms leave hints about what they are - key lengths, character patterns, file headers. It's not just about knowing the math.

### Password Cracking with John the Ripper

I used John the Ripper for the first time. It's a brute-force password cracking tool that systematically tries different combinations until it finds a match.

The power felt almost unsettling. Watching it churn through thousands of password attempts per second made me think differently about password security. Strong passwords aren't just good practice - they're necessary.

## The Fun Parts

Some flags were tricky and demanded creative thinking. The project encouraged hands-on problem solving instead of memorization. I wish more classes followed this format.

Finding hidden messages in network traffic felt like solving puzzles. Each discovery led to the next piece of the investigation.

## Extra Credit - KQL Adventures

The extra credit involved using Kusto Query Language (KQL) to analyze network flow logs. 

KQL is compact compared to SQL. Operations like group-by take fewer lines of code. But switching between the two languages hurt my brain initially - I'm so used to SQL from work.

Still, KQL seems powerful for telemetry data analysis. It has built-in functions for time-series data that would require custom code in SQL.

## Reflection

I truly LOVED this project, it's technical but also creative. You're not just developing algorithms - you're solving mysteries.

The preparation paid off. Reviewing networking basics beforehand let me focus on the actual investigation instead of learning protocols while under pressure.

Eight hours well spent. Looking forward to the next one.