<div align="center">

# 🌍 Language Learn Assistant

**A full-stack, language learning platform designed to help users master new languages through interactive flashcard sessions, reading comprehension, writing exercises, and listening practice.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-C%23-purple?style=for-the-badge&logo=dotnet)](https://dotnet.microsoft.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Learning Modules](#-learning-modules)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Docker Deployment](#-docker-deployment)
- [API Overview](#-api-overview)
- [License](#-license)

---

## 🎯 Overview

**Language Learn Assistant** is a comprehensive, full-stack language learning platform built as a personal learning and experimentation project. It combines modern web technologies on the frontend with a clean-architecture ASP.NET Core backend to deliver four distinct and interactive learning modalities:

| Module | Description |
|---|---|
| 🃏 **Flashcard** | Vocabulary-based learning with a shuffled card deck and yes/no rating system |
| 📖 **Reading** | Reading comprehension with inline text selection and AI-powered translation |
| ✍️ **Writing** | Writing practice with text input and AI-powered translation feedback |
| 🎧 **Listening** | Video-based listening exercises where users transcribe what they hear |

The platform supports multiple target languages, keeps complete session history, and provides rich progress tracking. On the infrastructure side it leverages Google Cloud for translation and file storage, Redis for caching, and a full observability stack (OpenTelemetry + Prometheus + Jaeger).

> **Note:** This project is actively used as a laboratory for experimenting with software patterns such as CQRS, MediatR, Clean Architecture, and various observability tools.

---

## ✨ Features

### 🧑‍🎓 Learning Experience
- **Multi-language support** — Choose from multiple target languages via a flag-based home screen
- **Four distinct practice modes** — Flashcard, Reading, Writing, and Listening
- **Session history** — All completed sessions are saved and can be reviewed
- **Translation** — Integrated Google Cloud Translate to provide instant translations during reading and writing sessions
- **Real-time interaction** — Socket.IO integration enables real-time session features

### 🔐 Authentication & Security
- **Email / Password** registration and login
- **Google OAuth** social login via Better Auth
- **JWT-based** session management with encrypted session IDs
- **bcrypt** password hashing

### 🏗️ Infrastructure & Observability
- **Distributed tracing** with OpenTelemetry (traces exported to Jaeger/OTLP)
- **Metrics** with Prometheus
- **Structured logging** with Pino + Elasticsearch
- **Caching** with Redis (backend layer)
- **File storage** via Google Cloud Storage
- **Dependency injection** with Inversify (frontend) and built-in .NET DI (backend)

### 📦 DevOps
- **Dockerized** — Multi-stage Dockerfile for the Next.js frontend
- **docker-compose** orchestration for the full stack including the OTel Collector, Prometheus, and database
- **Production-ready** environment configuration via `.env` files

---

## 🏛️ Architecture

The platform follows a clear separation between a **Next.js frontend** and an **ASP.NET Core backend**, communicating over a REST API. The frontend uses Next.js **Server Actions** as a proxy layer, ensuring API calls are never exposed directly to the browser.

![System Architecture](./diagrams/HOST%202.png)

### Frontend Architecture

```
Browser ──► Next.js (App Router)
               │
               ├── app/         (Pages & Routes)
               ├── src/components/  (UI Components)
               ├── src/page/        (Page-level logic & reducers)
               ├── src/actions/     (Server Actions → calls Backend REST API)
               └── src/infrastructure/
                       ├── auth/     (Better Auth client)
                       ├── store/    (Zustand global state)
                       ├── socket/   (Socket.IO client)
                       └── providers/ (Alert, Loading, Session context)
```

### Backend Architecture (Clean Architecture + CQRS)

```
src/
├── API/App.API          ← Presentation Layer
│   ├── Controllers/     ← REST endpoints
│   ├── Middlewares/     ← Request pipeline
│   ├── Filters/         ← Action filters
│   └── ExceptionHandlers/
│
├── core/
│   ├── App.Application  ← Application Layer
│   │   ├── Features/    ← CQRS Commands & Queries (MediatR)
│   │   ├── Contracts/   ← Repository interfaces
│   │   └── Common/      ← Shared application utilities
│   │
│   └── App.Domain       ← Domain Layer
│       ├── Entities/    ← Domain models
│       ├── Events/      ← Domain events
│       └── Exceptions/  ← Domain exceptions
│
└── infastructure/
    ├── App.Persistence  ← EF Core + MSSQL
    ├── App.Caching      ← Redis
    ├── App.Security     ← JWT
    ├── App.Storage      ← Google Cloud Storage
    ├── App.Observability← OpenTelemetry
    └── App.Integration  ← Third-party integrations
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router & Server Actions |
| **React 19** | UI library |
| **TypeScript 5** | Type safety |
| **Tailwind CSS 4** + **DaisyUI 5** | Styling |
| **Zustand** | Global state management |
| **Socket.IO Client** | Real-time communication |
| **bcryptjs** | Password hashing |
| **Lucide React** | Icon library |

### Backend

| Technology | Purpose |
|---|---|
| **ASP.NET Core** (C#) | Web API framework |
| **MediatR** | CQRS mediator pattern implementation |
| **Entity Framework Core** | ORM |
| **MSSQL (SQL Server)** | Primary relational database |
| **Redis** | Distributed caching |
| **JWT** | Token-based authentication |
| **FluentValidation** | Request validation (via MediatR pipeline behaviors) |
| **Google Cloud Storage** | File upload/download |
| **Google Cloud Translate** | Translation integration |
| **OpenTelemetry** | Distributed tracing |
| **Docker** | Containerization |

---

## 📁 Project Structure

### Frontend (`LanguageLearnAssistantASP`)

```
├── app/                            # Next.js App Router pages
│   ├── page.tsx                    # Home — language selection
│   ├── language/[...language]/     # Language-specific dashboard
│   ├── list/                       # Content list (decks & books)
│   ├── detail/                     # Content detail view
│   ├── add/                        # Add new content
│   ├── create/                     # Create new content
│   ├── edit/                       # Edit existing content
│   ├── practice/[...practice]/     # Practice session launcher
│   ├── session/                    # Active session screen
│   ├── profile/                    # User profile
│   └── auth/login | signup         # Authentication pages
│
├── src/
│   ├── actions/                    # Server Actions (API calls)
│   │   ├── Language/
│   │   ├── Practice/
│   │   ├── FlashcardCategory/
│   │   ├── DeckWord/
│   │   ├── FlashcardSessionRow/
│   │   ├── FlashcardOldSession/
│   │   ├── ReadingBook/
│   │   ├── ReadingSessionRow/
│   │   ├── ReadingOldSession/
│   │   ├── WritingBook/
│   │   ├── WritingSessionRow/
│   │   ├── WritingOldSession/
│   │   ├── ListeningCategory/
│   │   ├── DeckVideo/
│   │   ├── ListeningSessionRow/
│   │   ├── ListeningOldSession/
│   │   ├── Translation/
│   │   └── User/
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── FlashcardSessionComponent/
│   │   ├── ReadingSessionComponent/
│   │   ├── WritingSessionComponent/
│   │   ├── ListeningSessionComponent/
│   │   ├── NavbarComponent/
│   │   ├── MenuComponent/
│   │   ├── FlagComponent/
│   │   ├── AlertComponent/
│   │   ├── PaginationComponent/
│   │   └── ...
│   │
│   ├── page/                       # Page-level logic (reducers, effects)
│   │   ├── HomePage/
│   │   ├── LanguagePage/
│   │   ├── ListPage/
│   │   ├── PracticePage/
│   │   ├── SessionPage/
│   │   └── ...
│   │
│   └── infrastructure/
│       ├── auth/                   # Better Auth integration
│       ├── store/                  # Zustand global store
│       ├── socket/                 # Socket.IO client
│       ├── security/               # Encryption utilities
│       ├── common/                 # HTTP client, status codes
│       └── providers/              # React context providers
│
├── styles/globals.css
├── Dockerfile
├── next.config.ts
└── package.json
```

---

## 📚 Learning Modules

### 🃏 Flashcard Module

The flashcard module allows users to create **word decks** organized by category. During a session:

1. Words are **shuffled randomly** at the start
2. The user is shown the **question** (e.g., source language word)
3. The user rates their knowledge using **Yes / No** buttons
4. Words marked as "No" are recycled back into the deck
5. The session ends when all words are marked as "Yes"
6. The complete session row data is submitted and saved to history

**Key Entities:** `FlashcardCategory` → `DeckWord` → `FlashcardSessionRow` → `FlashcardOldSession`

---

### 📖 Reading Module

The reading module presents the user with **reading books** containing longer text passages. During a session:

1. The user reads the passage at their own pace
2. They can **select any portion of text** to request a translation
3. The selected text is sent to the **Google Cloud Translate API** and the translated result is displayed inline
4. Session interaction rows are recorded for later review

**Key Entities:** `ReadingBook` → `ReadingSessionRow` → `ReadingOldSession`

---

### ✍️ Writing Module

The writing module is designed to improve writing skills through translation-based exercises. During a session:

1. The user types text in the **target language**
2. They can request an **AI-powered translation** of their writing
3. The translation is displayed alongside their original input
4. Session rows record each writing entry for history tracking

**Key Entities:** `WritingBook` → `WritingSessionRow` → `WritingOldSession`

---

### 🎧 Listening Module

The listening module improves listening comprehension using **video content**. During a session:

1. A video from the selected listening deck is played
2. The user **listens and types** what they heard (dictation-style exercise)
3. After the video ends, the user submits their transcription
4. The answer is evaluated using **string similarity** matching
5. The result (correct / incorrect) is shown with the right answer if needed

**Key Entities:** `ListeningCategory` → `DeckVideo` → `ListeningSessionRow` → `ListeningOldSession`

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | >= 20 |
| npm | >= 10 |
| SQL Server | 2019+ (or Azure SQL) |
| Redis | 7+ |
| .NET SDK | 8.0+ (for backend) |
| Docker (optional) | Latest |

### 1. Clone the Repository

```bash
git clone https://github.com/alprslanymeria/LanguageLearnAssistantASP.git
cd LanguageLearnAssistantASP
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

See the [Environment Variables](#-environment-variables) section for details.

### 4. Set Up the Database

```bash
# Push the Prisma schema to your SQL Server
npx prisma db push

# Or create and run a migration
npx prisma migrate dev --name init
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

### Backend Setup

Clone and run the backend separately:

```bash
git clone https://github.com/alprslanymeria/LanguageLearnAssistantBackend.git
cd LanguageLearnAssistantBackend
git checkout feature/mediatR_CQRS_implementation
```

Configure the backend using `.env.template` as a reference, then:

```bash
dotnet restore
dotnet run --project src/API/App.API
```

---

## ⚙️ Environment Variables

Below are the key environment variables required by the frontend. See `.env.example` for the full list.

```env
# --- APPLICATION ---
NEXT_PUBLIC_APP_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# --- DATABASE (Prisma + MSSQL) ---
DATABASE_URL="sqlserver://localhost:1433;database=LanguageLearnDB;user=sa;password=YOUR_PASSWORD;trustServerCertificate=true"

# --- BETTER AUTH ---
BETTER_AUTH_SECRET=your_secret_at_least_32_characters
BETTER_AUTH_URL=http://localhost:3000

# --- GOOGLE OAUTH ---
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# --- GOOGLE CLOUD ---
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
GOOGLE_CLOUD_BUCKET_NAME=your_bucket_name

# --- REDIS ---
REDIS_URL=redis://localhost:6379

# --- OPEN TELEMETRY ---
OTEL_TRACES_EXPORTER=otlp
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
OTEL_SERVICE_NAME=language-learn-frontend
```

---

## 🐳 Docker Deployment

### Frontend

The frontend includes a production-ready multi-stage Dockerfile based on `node:24-alpine`:

```bash
# Build the image
docker build -t language-learn-frontend .

# Run the container
docker run -p 3000:3000 --env-file .env language-learn-frontend
```

### Full Stack with docker-compose

The backend repository includes a `docker-compose.yml` that orchestrates:

- ASP.NET Core API
- SQL Server
- Redis
- OpenTelemetry Collector
- Prometheus
- Jaeger (distributed tracing UI)

```bash
# From the backend repository root
docker-compose up --build
```

---

## 📡 API Overview

The backend exposes a versioned REST API at `/api/v1/`. All endpoints follow the CQRS pattern via MediatR on the backend.

| Controller | Route | Description |
|---|---|---|
| `LanguageController` | `/api/v1/Language` | Language CRUD |
| `PracticeController` | `/api/v1/Practice` | Practice types by language |
| `FlashcardCategoryController` | `/api/v1/FlashcardCategory` | Flashcard deck management |
| `DeckWordController` | `/api/v1/DeckWord` | Vocabulary word management |
| `FlashcardSessionRowController` | `/api/v1/FlashcardSessionRow` | Flashcard session tracking |
| `FlashcardOldSessionController` | `/api/v1/FlashcardOldSession` | Flashcard session history |
| `ReadingBookController` | `/api/v1/ReadingBook` | Reading book management |
| `ReadingSessionRowController` | `/api/v1/ReadingSessionRow` | Reading session tracking |
| `ReadingOldSessionController` | `/api/v1/ReadingOldSession` | Reading session history |
| `WritingBookController` | `/api/v1/WritingBook` | Writing book management |
| `WritingSessionRowController` | `/api/v1/WritingSessionRow` | Writing session tracking |
| `WritingOldSessionController` | `/api/v1/WritingOldSession` | Writing session history |
| `ListeningCategoryController` | `/api/v1/ListeningCategory` | Listening deck management |
| `ListeningSessionRowController` | `/api/v1/ListeningSessionRow` | Listening session tracking |
| `ListeningOldSessionController` | `/api/v1/ListeningOldSession` | Listening session history |
| `TranslateController` | `/api/v1/Translate` | Translation endpoint |

---

## 🔗 Related Repositories

| Repository | Description |
|---|---|
| [LanguageLearnAssistantASP](https://github.com/alprslanymeria/LanguageLearnAssistantASP) | This repository — Next.js frontend |
| [LanguageLearnAssistantBackend](https://github.com/alprslanymeria/LanguageLearnAssistantBackend/tree/feature/mediatR_CQRS_implementation) | ASP.NET Core backend (CQRS + MediatR) |

---

## 📄 License

This project is open source and available under the [MIT License](./LICENSE).
