---
layout: post
title: CloudScale Finance ETL (In Progress)
published: true
order: 2
description:
  A cloud-native ETL pipeline for ingesting, transforming, and analyzing financial market data using AWS, GCP, Docker, and Apache Airflow. This project is currently under active development and serves as a hands-on demonstration of modern data engineering and DevOps practices.
skills:
  - ETL Development
  - AWS Lambda & S3
  - Google BigQuery
  - Apache Airflow
  - Docker & CI/CD
  - Terraform IaC
  - Monitoring & Alerting
main-image: /cs_cover.jpg
---

## 🚧 In Progress

This project is currently under development. Once complete, it will showcase:

- Automated ingestion of stock market data from APIs (Alpha Vantage, Yahoo Finance)
- Serverless data transformation via AWS Lambda
- Cloud data warehousing with Google BigQuery
- CI/CD and Infrastructure-as-Code with GitHub Actions and Terraform
- Airflow orchestration for reliable scheduling
- Monitoring, alerting, and cost optimization strategies

## 🧠 Why I'm Building This (Educational Project)

I designed CloudScale ETL as a structured way to upskill in modern data engineering. It’s an educational, portfolio-focused project intended to reinforce the fundamentals:

- Build a working end-to-end pipeline with clear code
- Practice cloud-native patterns (serverless, IaC, monitoring) without over-engineering
- Document architecture and tradeoffs so others can learn from my approach

This is not a production workload—it's a teaching vehicle and a skills benchmark that I’m iterating on publicly.

## 📊 Architecture Overview (Preview)

The pipeline will follow this general flow:
```text
         ┌────────────┐
         │ Financial  │
         │   APIs     │
         │ (e.g., AV) │
         └────┬───────┘
              │
              ▼
       ┌─────────────┐
       │  AWS S3     │
       │ Raw Storage │
       └────┬────────┘
            │
            ▼
     ┌──────────────┐
     │ AWS Lambda   │
     │ (Transform)  │
     └────┬─────────┘
          │
          ▼
   ┌─────────────────┐
   │ Google BigQuery │
   │   Warehouse     │
   └────┬────────────┘
        │
        ▼
   ┌──────────────┐
   │ Data Studio /│
   │ Looker / BI  │
   └──────────────┘
```

Both development and production architectures will be containerized and cloud-integrated for scalability and cost-effectiveness.

## 🛠️ Tech Stack

- **Languages & Tools**: Python, Docker, Terraform
- **Cloud Providers**: AWS (S3, Lambda, CloudWatch), GCP (BigQuery)
- **Workflow Orchestration**: Apache Airflow
- **DevOps**: GitHub Actions, LocalStack, Monitoring/Alerting
- **Data Processing**: Pandas, Technical Indicators (SMA, RSI, VWAP)

## 🔗 GitHub

You can follow the latest development progress or explore the source code here:  
👉 [View on GitHub](https://github.com/itsSaul24/cloudscale-finance-etl)

---

## 📁 Status

Architecture diagrams, transformation code, validation logic, and monitoring dashboards are being actively developed. Full documentation, demo video, and a live walkthrough will be added when completed.

Stay tuned!
