# 🚚 Delivery Partner Decision Intelligence Platform

A full-stack decision intelligence platform for analyzing delivery partner performance and supporting operational decisions using delivery cost, speed, reliability, and customer ratings.

![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render&logoColor=white)

## 🔗 Links

- 🌐 **Live Demo:** https://delivery-partner-decision-frontend.onrender.com
- 📦 **GitHub:** https://github.com/Vanisha07/delivery-partner-decision-platform
- 📖 **API Documentation:** https://delivery-partner-decision-platform.onrender.com/docs

---


## ✨ Features

- 📊 Overall delivery KPI dashboard
- 🚚 Delivery partner performance analysis
- 🌎 Regional performance analysis
- ⭐ Partner recommendations
- 🔍 Partner performance by region
- 🧮 What-if delivery allocation simulation
- 💰 Projected cost savings
- ⏱️ Projected delivery-time impact
- 📈 Projected on-time delivery impact
- 🔌 REST APIs for decision-support operations
- 🐘 PostgreSQL database integration
- 🐳 Dockerized development environment
- ☁️ Production deployment using Render

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      Next.js        │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               │ REST APIs
                               ▼
                    ┌─────────────────────┐
                    │       FastAPI       │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
             ┌──────────────┐      ┌──────────────┐
             │ Decision     │      │ PostgreSQL   │
             │ Engine       │      │ Database     │
             └──────────────┘      └──────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, JavaScript, CSS |
| Backend | Python, FastAPI, Pydantic, Pandas |
| Database | PostgreSQL |
| API | REST |
| DevOps | Docker, Docker Compose, Render |

---

## 🧠 Decision Engine

The platform analyzes delivery data across multiple operational dimensions:

- Delivery cost
- On-time delivery rate
- Delivery time
- Customer rating
- Partner performance
- Regional performance

The decision engine processes these metrics to identify suitable delivery partners for different regions and provide operational recommendations.

---

## 🧮 What-If Simulation

The simulation feature evaluates a potential delivery partner change before an operational decision is made.

Example:

```text
Region: North
Current Partner: Partner A
New Partner: Partner B
Delivery Shift: 20%
```

The system calculates:

- Number of deliveries shifted
- Current partner cost
- New partner cost
- Projected cost savings
- Current on-time rate
- New on-time rate
- Projected on-time rate
- Current delivery time
- New delivery time
- Projected delivery time

This provides a quantitative view of the expected impact of changing delivery allocation.

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | API health check |
| `/api/kpis` | GET | Overall delivery KPIs |
| `/api/partners` | GET | Partner performance |
| `/api/regions` | GET | Regional performance |
| `/api/recommendations` | GET | Partner recommendations |
| `/api/partner-region` | GET | Partner performance by region |
| `/api/simulate` | POST | What-if allocation simulation |

Interactive Swagger documentation:

`https://delivery-partner-decision-platform.onrender.com/docs`

---

## 📁 Project Structure

```text
delivery-partner-decision-platform/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── schemas.py
│   │   └── services/
│   │       └── decision_engine.py
│   └── Dockerfile
│
├── database/
├── data/
│
├── frontend/
│   ├── app/
│   ├── package.json
│   └── ...
│
├── screenshots/
│   ├── dashboard.png
│   ├── partner-analysis.png
│   └── simulation.png
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Git
- Docker
- Docker Compose

### Clone the repository

```bash
git clone https://github.com/Vanisha07/delivery-partner-decision-platform.git
cd delivery-partner-decision-platform
```

### Run with Docker Compose

```bash
docker compose up --build
```

The application will be available at:

```text
Frontend:  http://localhost:3000
Backend:   http://localhost:8000
Swagger:   http://localhost:8000/docs
```

### Stop the application

```bash
docker compose down
```

To remove the PostgreSQL data volume as well:

```bash
docker compose down -v
```

---

## 📊 Example KPI Response

```json
{
  "deliveries": 25000,
  "delivery_cost": 21623614.47,
  "on_time_rate": 78.14,
  "avg_delivery_time": 6.25,
  "avg_rating": 3.67,
  "partners": 9,
  "regions": 5
}
```

---

## ☁️ Deployment

The application is deployed as separate frontend and backend services on Render.

```text
Next.js Frontend
       │
       │ HTTPS REST API
       ▼
FastAPI Backend
       │
       ▼
PostgreSQL
```

The frontend communicates with the production FastAPI backend through the configured production API URL.

---

## 🔮 Future Improvements

- Dynamic partner scoring
- Machine learning based demand forecasting
- Real-time delivery data ingestion
- Historical performance tracking
- Authentication and role-based access
- Automated partner allocation
- Optimization with cost and SLA constraints

---

## 👩‍💻 Author

**Vanisha Verma**

- GitHub: https://github.com/Vanisha07
- LinkedIn: https://www.linkedin.com/in/vanisha-verma

## 📄 License

This project is licensed under the MIT License.
