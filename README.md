# 🗂️ D-Drive Projects — Master Reference

> A complete reference guide for all projects stored in this workspace.
> **Author:** Debabrata Karfa / Rahul · **Org:** Webbixel / VAIS
> **Last Updated:** July 2026

---

## 📌 Table of Contents

| # | Project | Type | Stack |
|---|---------|------|-------|
| 1 | [Chat_App](#1-chat_app) | Full-Stack | React + Node.js + Socket.IO + MongoDB |
| 2 | [DesktopApp / DesktopApp1 / DesktopApp2](#2-desktopapp--desktopapp1--desktopapp2) | Desktop | Electron + Electron Forge |
| 3 | [DrastaMain](#3-drastamain) | Full-Stack | Spring Boot + React + MongoDB + PhonePe |
| 4 | [ForDeploy](#4-fordeploy) | Deploy Bundle | Various |
| 5 | [Frontend](#5-frontend) | Static Web | HTML + CSS + JS |
| 6 | [GoogleLoginTest](#6-googlelogintest) | Full-Stack | React + Node.js + Google OAuth 2.0 |
| 7 | [LoanFlowPro](#7-loanflowpro) | Full-Stack SaaS | React + Express + Drizzle ORM + PostgreSQL |
| 8 | [MNS_Frontend_Vais-main](#8-mns_frontend_vais-main) | Frontend | React + Vite |
| 9 | [MyProject](#9-myproject) | Multi-Sub-Project | Various Clients |
| 10 | [NestTest](#10-nesttest) | Backend | NestJS |
| 11 | [NextTest](#11-nexttest) | Frontend | Next.js |
| 12 | [OldVersionDentalClinic](#12-oldversiondentalclinic) | Backend | Node.js + Express |
| 13 | [PDFandEXCEL](#13-pdfandexcel) | Utility | React + Vite + react-pdf |
| 14 | [Saas_School_Frontend_New](#14-saas_school_frontend_new) | Frontend SaaS | React + Vite + Tailwind |
| 15 | [Saas_Signup_backend](#15-saas_signup_backend) | Backend | Node.js + Razorpay |
| 16 | [ShippingSystem](#16-shippingsystem) | Full-Stack | React + Node.js + Shiprocket API |
| 17 | [ShopSphere](#17-shopsphere) | Full-Stack | React |
| 18 | [springBootAuth](#18-springbootauth) | Backend | Spring Boot 3.5 + Java 17 |
| 19 | [ssChildren](#19-sschildren) | Frontend | React + Vite |
| 20 | [subscriptionOrPaymentPage](#20-subscriptionorpaymentpage) | Frontend | React + Vite |
| 21 | [VaisAi](#21-vaisai) | Frontend | React + TypeScript + Vite |
| 22 | [happySalon](#22-happysalon) | Frontend | React + Vite |
| 23 | [whatsappapi](#23-whatsappapi) | Backend SaaS | Node.js + whatsapp-web.js + MongoDB |
| 24 | [school_frontendV2](#24-school_frontendv2) | Frontend | React + Vite |
| 25 | [deploy_school_frontend](#25-deploy_school_frontend) | Frontend | React + Vite |
| 26 | [sidebar](#26-sidebar) | UI Component | React + Vite |
| 27 | [TestSchemaChangeDynamic](#27-testschemachangedynamic) | Experiment | React + Vite |
| 28 | [saszip](#28-saszip) | Archive | Compressed files |

---

## 1. Chat_App

**Path:** Chat_App/
**Type:** Full-Stack Real-Time Chat Application

A secure two-way chat application with real-time messaging, file/image upload support, and JWT-based authentication.

### Structure
`
Chat_App/
├── Frontend/    ← React + Vite SPA
└── Backend/     ← Node.js + Express + Socket.IO
`

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Real-time | Socket.IO |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt |
| File Upload | Multer |

### Run
`ash
cd Chat_App/Backend && npm install && npm run dev
cd Chat_App/Frontend && npm install && npm run dev
`

---

## 2. DesktopApp / DesktopApp1 / DesktopApp2

**Paths:** DesktopApp/, DesktopApp1/, DesktopApp2/
**Type:** Cross-Platform Desktop Applications
**Author:** Debabrata Karfa — debabrata.k@webbixel.com

Electron-based desktop applications built with Electron Forge. Three iterations of a desktop client app packaged for Windows/Mac/Linux.

### Tech Stack
| Technology | Version |
|-----------|---------|
| Electron | 37.2.6 |
| Electron Forge | 7.8.3 |
| node-fetch | 3.x |

### Build & Run
`ash
cd DesktopApp
npm install
npm start           # Development
npm run make        # Build installer
npm run package     # Package app
`

---

## 3. DrastaMain

**Path:** DrastaMain/
**Type:** Full-Stack Enterprise Application

 Drasta is an enterprise-grade application with Spring Boot backend featuring GraphQL, PDF generation, PhonePe payment integration, and AI capabilities.

### Sub-Projects
| Folder | Description |
|--------|-------------|
| Drasta/ | Main Spring Boot backend |
| Darasta/ | Alternate iteration |
| Drasta-Frontend/ | React frontend |
| Drasta-V1-Admin/ | Admin panel V1 |
| drasta-old/ | Legacy version |

### Tech Stack — Backend (Drasta/)
| Technology | Details |
|-----------|---------|
| Framework | Spring Boot 3.5.0 |
| Language | Java 17 |
| Security | Spring Security + JWT (JJWT 0.11.5) |
| Database | MongoDB |
| API | REST + GraphQL |
| Payments | PhonePe SDK v2.1.4 |
| PDF | iTextPDF 7.2.5 |
| Media | Cloudinary |
| Email | Spring Mail |
| AI | Spring AI 1.0.0 |
| Testing | JUnit 5, Mockito 5 |

### Run
`ash
cd DrastaMain/Drasta
./mvnw spring-boot:run
`

---

## 4. ForDeploy

**Path:** ForDeploy/
**Type:** Deployment Bundle / Production Builds

Collection of production-ready deployable versions of client projects.

### Sub-Projects
| Folder | Client |
|--------|--------|
| Dspharma/ | DS Pharma |
| GreenTree/ | Green Tree Nursery |
| MNS_Backend/ | MNS backend API |
| MNS_Frontend/ | MNS frontend |
| VaisMainPage/ | Vais main landing |
| irway india/ | Airway India |
| lamin/ | Alamin client |
| darasta/ | Darasta project |
| digital dreams/ | Digital Dreams |
| digitalDreamNew/ | Digital Dreams (new) |
| happySalon/ | Happy Salon |
| maqam/ | Maqam project |
| mondal/ | Mondal Nursery |
| plantDekho/ | Plant Dekho |
| saas billing/ | SaaS Billing |
| speeds/ | Speeds loan |
| ss children/ | SS Children Academy |
| unix-main/ | Unix main |
| ais/ | Vais main |
| aisProductions/ | Vais Productions |
| TestFrontend/ | Test frontend |

> NOTE: This folder is a deploy archive. Do not develop here. Work in source directories.

---

## 5. Frontend

**Path:** Frontend/
**Type:** Static Web Page

Simple standalone static frontend: index.html, style.css, script.js.

---

## 6. GoogleLoginTest

**Path:** GoogleLoginTest/
**Type:** Full-Stack Authentication Boilerplate

Complete Google OAuth 2.0 integration with JWT authentication. Provides login/signup with email/password and Google One-Tap login.

### Structure
`
GoogleLoginTest/
├── Backend/     ← Node.js + Express + MongoDB
├── Frontend/    ← React + Vite + Shadcn UI
├── implementation_plan.md
└── walkthrough.md
`

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Shadcn UI |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | Google OAuth 2.0 + JWT (httpOnly cookie) |
| State | React Context API |

### API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/v1/auth/register | Register with email/password |
| POST | /api/v1/auth/login | Login with email/password |
| POST | /api/v1/auth/google-login | Google OAuth login |
| POST | /api/v1/auth/logout | Logout |
| GET | /api/v1/auth/me | Get current user |

### Environment Variables
Backend .env:
`
MONGO_URI=...
JWT_SECRET=...
CORS_ORIGIN=http://localhost:5173
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
`
Frontend .env:
`
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=...
`

### Run
`ash
cd GoogleLoginTest/Backend && npm install && npm run dev   # port 5000
cd GoogleLoginTest/Frontend && npm install && npm run dev  # port 5173
`

---

## 7. LoanFlowPro

**Path:** LoanFlowPro/
**Type:** Full-Stack SaaS — Loan Management System

Comprehensive loan management and workflow platform. Full-stack monorepo with React frontend, Express backend, PostgreSQL via Drizzle ORM, and real-time WebSocket support.

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Radix UI, Shadcn UI |
| Backend | Node.js, Express 4 |
| Database | PostgreSQL (NeonDB serverless) |
| ORM | Drizzle ORM + drizzle-zod |
| Auth | Passport.js + express-session |
| Real-time | WebSocket (ws) |
| Charts | Recharts |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Routing | Wouter |

### Run
`ash
cd LoanFlowPro
npm install
npm run dev        # Dev server
npm run db:push    # Push DB schema
`

---

## 8. MNS_Frontend_Vais-main

**Path:** MNS_Frontend_Vais-main/
**Type:** Frontend — MNS Client Application

Frontend for the MNS business management system, built with React + Vite.

### Run
`ash
cd MNS_Frontend_Vais-main && npm install && npm run dev
`

---

## 9. MyProject

**Path:** MyProject/
**Type:** Multi-Client Project Archive (38+ sub-projects)

Large archive of client projects and utilities across multiple industries.

### Notable Sub-Projects
| Folder | Description |
|--------|-------------|
| AfsanaNursery/ | Nursery e-commerce |
| Attendance/ | Attendance tracking |
| BeautifulSalon/ | Salon management |
| Bulk mail sender/ | Bulk email tool |
| CRM+/ | CRM system |
| DS Pharma/ | Pharma website |
| Dental_Backend/ | Dental clinic backend |
| ExpenseTracker/ | Expense tracker |
| FaceAttendance/ | Face recognition attendance |
| JSP_Pharma/ | JSP Pharma website |
| LocationAndLoan/ | Location + loan app |
| MNS Main/ | MNS main app |
| MNS_backend_new/ | Latest MNS backend |
| Maqam/ | Maqam project |
| Mit(speed)loan/ | Speed loan management |
| Saas School/ | School management SaaS |
| TamannaahBilling/ | Billing app |
| VaisAcademicHomePage/ | Vais Academic landing |
| VaisBilling/ | Vais billing system |
| irwayIndia/ | Airway India |
| petNeverland/ | Pet care shop |
| school-frontend/ | School frontend |
| ais-enginnering-master/ | Vais Engineering master |

---

## 10. NestTest

**Path:** NestTest/
**Type:** NestJS Backend Experiment

NestJS framework testing and exploration project.

---

## 11. NextTest

**Path:** NextTest/
**Type:** Next.js Frontend Experiment

Next.js framework testing for SSR/SSG features.

---

## 12. OldVersionDentalClinic

**Path:** OldVersionDentalClinic/
**Type:** Legacy Backend — Dental Clinic Management

> WARNING: Legacy project. Use MyProject/Dental_Backend/ for the current version.

---

## 13. PDFandEXCEL

**Path:** PDFandEXCEL/
**Type:** Frontend Utility — PDF & Excel Generator

React + Vite utility app for generating PDF and Excel documents from data using react-pdf.

### Run
`ash
cd PDFandEXCEL && npm install && npm run dev
`

---

## 14. Saas_School_Frontend_New

**Path:** Saas_School_Frontend_New - Copy/
**Type:** Frontend SaaS — School Management

Feature-rich school management SaaS frontend with Tailwind CSS and Shadcn UI components.

### Run
`ash
cd Saas_School_Frontend_New - Copy && npm install && npm run dev
`

---

## 15. Saas_Signup_backend

**Path:** Saas_Signup_backend/
**Type:** Backend — SaaS Subscription & Payment

Node.js backend for handling SaaS user signup and subscription management with Razorpay payment integration.

### Structure
`
Saas_Signup_backend/
├── index.js              ← Entry + routes
├── User.js               ← User model
├── Subscription.js       ← Subscription model
├── razorpay.js           ← Razorpay config
└── razorpayController.js ← Payment logic
`

### Environment Variables
`
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
MONGO_URI=...
`

---

## 16. ShippingSystem

**Path:** ShippingSystem/
**Type:** Full-Stack — Shipping & Logistics Management

Shipping management system integrated with Shiprocket API for order tracking and shipment creation.

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| HTTP Client | Axios (Shiprocket API) |
| Database | MongoDB (Mongoose) |
| Logging | Morgan |

### Run
`ash
cd ShippingSystem/backend && npm install && npm run dev
cd ShippingSystem/frontend && npm install && npm run dev
`

---

## 17. ShopSphere

**Path:** ShopSphere/
**Type:** E-Commerce Platform

E-commerce / shopping platform with a speed/ sub-project.

---

## 18. springBootAuth

**Path:** springBootAuth/
**Type:** Backend — Spring Boot Auth Boilerplate
**Author:** Rahul (com.rahul)

Spring Boot authentication demo/learning project. JWT and security dependencies are commented out and ready to enable.

### Tech Stack
| Technology | Version |
|-----------|---------|
| Spring Boot | 3.5.5 |
| Java | 17 |
| Lombok | Latest |
| Build | Maven |

### Run
`ash
cd springBootAuth && ./mvnw spring-boot:run
`

---

## 19. ssChildren

**Path:** ssChildren/
**Type:** Frontend — SS Children Academy

Frontend for the SS Children Academy educational institution.

---

## 20. subscriptionOrPaymentPage

**Path:** subscriptionOrPaymentPage/
**Type:** Frontend — Subscription / Payment UI

React + Vite frontend for a subscription pricing or payment checkout flow.

### Run
`ash
cd subscriptionOrPaymentPage && npm install && npm run dev
`

---

## 21. VaisAi

**Path:** VaisAi/
**Type:** Frontend — AI Interface Application

React + TypeScript + Vite application for an AI-powered interface. React Compiler is enabled for optimized performance.

### Tech Stack
| Technology | Details |
|-----------|---------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Compiler | React Compiler (enabled) |

### Run
`ash
cd VaisAi && npm install && npm run dev
`

---

## 22. happySalon

**Path:** happySalon/
**Type:** Frontend — Salon Management Application

React + Vite frontend for the Happy Salon booking and management application.

### Run
`ash
cd happySalon && npm install && npm run dev
`

---

## 23. whatsappapi

**Path:** whatsappapi/
**Type:** Backend SaaS — Multi-User WhatsApp Platform

Multi-user WhatsApp SaaS platform. Users connect their WhatsApp via QR code and send messages programmatically via REST API with unique API keys.

### Tech Stack
| Technology | Details |
|-----------|---------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | MongoDB |
| WhatsApp | whatsapp-web.js |
| Auth | JWT + API Key |

### Key Features
- Multi-user architecture (per-user WhatsApp sessions)
- QR code-based WhatsApp connection
- Message template system with {{variable}} syntax
- Dual auth: JWT for dashboard, API key for REST API
- Session persistence (auto-reconnect on restart)

### API Reference

Send message:
`http
POST /api/public/send
x-api-key: <your-api-key>

{ to: 919876543210, message: Hello! }
`

Send template:
`http
POST /api/public/send-template
x-api-key: <your-api-key>

{ to: 919876543210, templateName: Order Ready, variables: { name: Rahul } }
`

### Auth Routes
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/whatsapp/qr | Get QR code |
| GET | /api/whatsapp/status | Connection status |

### Run
`ash
cd whatsappapi && npm install && npm run dev
# Open: http://localhost:3000
`

> NOTE: Requires MongoDB running locally or MongoDB Atlas URI in .env

---

## 24. school_frontendV2

**Path:** school_frontendV2/
**Type:** Frontend — School Management V2

Version 2 of the school management system frontend with React + Vite.

---

## 25. deploy_school_frontend

**Path:** deploy_school_frontend/
**Type:** Frontend — School Frontend (Production)

Production-ready version of the school frontend configured for deployment.

---

## 26. sidebar

**Path:** sidebar/
**Type:** UI Component / Prototype

Sidebar navigation UI component prototype built with React + Vite.

---

## 27. TestSchemaChangeDynamic

**Path:** TestSchemaChangeDynamic/
**Type:** Experimental

Test project for dynamic schema changes — form generation, schema evolution, or multi-tenant SaaS schema management research.

---

## 28. saszip

**Path:** saszip/
**Type:** Archive

Compressed archive of SaaS-related project files for backup or transfer.

---

## 🛠️ Tech Stack Summary

| Technology | Projects |
|-----------|----------|
| **React + Vite** | Chat_App, GoogleLoginTest, LoanFlowPro, happySalon, PDFandEXCEL, VaisAi, ShippingSystem, subscriptionOrPaymentPage, MNS_Frontend, Saas_School_Frontend_New |
| **Node.js + Express** | Chat_App, GoogleLoginTest, whatsappapi, ShippingSystem, Saas_Signup_backend |
| **Spring Boot (Java)** | DrastaMain/Drasta, springBootAuth |
| **MongoDB** | Chat_App, GoogleLoginTest, whatsappapi, DrastaMain, ShippingSystem |
| **PostgreSQL** | LoanFlowPro |
| **Tailwind CSS** | LoanFlowPro, Saas_School_Frontend_New, MNS_Frontend_Vais |
| **Shadcn / Radix UI** | LoanFlowPro, GoogleLoginTest, Saas_School_Frontend_New |
| **JWT Auth** | Chat_App, GoogleLoginTest, whatsappapi, DrastaMain |
| **Electron** | DesktopApp, DesktopApp1, DesktopApp2 |
| **Razorpay** | Saas_Signup_backend |
| **PhonePe** | DrastaMain/Drasta |
| **Shiprocket** | ShippingSystem |
| **Google OAuth** | GoogleLoginTest |
| **Socket.IO** | Chat_App |
| **TypeScript** | VaisAi, LoanFlowPro |

---

## 📂 Quick Directory Reference

`
C:\D drive\
├── Chat_App\                       → Real-time chat (React + Socket.IO + MongoDB)
├── DesktopApp\                     → Electron desktop app v1
├── DesktopApp1\                    → Electron desktop app v1.1
├── DesktopApp2\                    → Electron desktop app v2
├── DrastaMain\                     → Enterprise app (Spring Boot + MongoDB + PhonePe)
├── ForDeploy\                      → Production deploy bundles (20+ client projects)
├── Frontend\                       → Static HTML/CSS/JS page
├── GoogleLoginTest\                → Google OAuth 2.0 full-stack boilerplate
├── LoanFlowPro\                    → Loan management SaaS (React + Express + PostgreSQL)
├── MNS_Frontend_Vais-main\         → MNS client frontend
├── MyProject\                      → Multi-client project archive (38+ projects)
├── NestTest\                       → NestJS experiments
├── NextTest\                       → Next.js experiments
├── OldVersionDentalClinic\         → Legacy dental clinic backend
├── PDFandEXCEL\                    → PDF and Excel generation utility
├── Saas_School_Frontend_New - Copy\→ School SaaS frontend (new)
├── Saas_Signup_backend\            → SaaS signup + Razorpay payments
├── ShippingSystem\                 → Shipping management + Shiprocket API
├── ShopSphere\                     → E-commerce platform
├── Test\                           → Generic test project
├── TestSchemaChangeDynamic\        → Dynamic schema experiments
├── VaisAi\                         → AI interface (React + TypeScript)
├── deploy_school_frontend\         → School frontend deploy version
├── happySalon\                     → Happy Salon frontend
├── saszip\                         → Archive zip files
├── school_frontendV2\              → School management frontend V2
├── sidebar\                        → Sidebar UI component
├── springBootAuth\                 → Spring Boot auth boilerplate (Java 17)
├── ssChildren\                     → SS Children Academy frontend
├── subscriptionOrPaymentPage\      → Subscription and payment UI
└── whatsappapi\                    → WhatsApp SaaS multi-user platform
`

---

## 🔑 Developer Notes

- Always check for .env files before running any project.
- For projects with both rontend/ and ackend/ folders, run both servers in separate terminals.
- ForDeploy/ and MyProject/ are archives — always work in source directories.
- whatsappapi requires a real WhatsApp-connected phone for QR scanning.
- DrastaMain/Drasta is the most feature-complete backend — reference it for Spring Boot patterns.
- GoogleLoginTest is the canonical OAuth template — reuse it for new projects.
- LoanFlowPro is the canonical React + Express + PostgreSQL template.

---

*This README was generated by Antigravity AI (July 2026).*
