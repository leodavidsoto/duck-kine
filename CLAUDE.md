# Duck Kinesiologia - Project Guide

## Project Structure

```
duck kine/
├── frontend/                 # Next.js 16 (React 19) + Capacitor Android
│   ├── src/app/              # App Router pages
│   ├── android/              # Capacitor Android project
│   └── capacitor.config.ts
├── backend/                  # Express.js 5 API + Prisma + PostgreSQL
│   ├── src/
│   │   ├── index.js          # App entry — Express + Socket.io
│   │   ├── config/           # env.js, cors.js, database.js (Prisma client)
│   │   ├── routes/           # 14 route files (auth, patients, whatsapp, etc.)
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic (13 services)
│   │   ├── middleware/       # auth, roles, tenant, rateLimiter, validate, errorHandler
│   │   └── scheduler/        # CRON jobs (reminders, follow-ups, no-show detection)
│   ├── prisma/
│   │   └── schema.prisma     # 38 models, multi-tenant (Organization/Clinic/Franchise)
│   └── .env                  # Local config (DO NOT commit)
└── mission-control-kine/     # Agent orchestration dashboard (separate project)
```

## Tech Stack

- **Frontend**: Next.js 16.1.6, React 19, Bootstrap CSS, Capacitor 8 (Android)
- **Backend**: Express.js 5.2.1, Node.js, TypeScript config available
- **Database**: PostgreSQL + Prisma 7.4.1
- **Payments**: Transbank Webpay Plus SDK 6.1.1 (Chilean payment gateway)
- **Auth**: JWT (jsonwebtoken), bcryptjs, role-based (PATIENT, PROFESSIONAL, ADMIN, etc.)
- **Real-time**: Socket.io 4.8.3
- **AI**: Anthropic Claude API (@anthropic-ai/sdk) for WhatsApp bot
- **Mobile**: Capacitor with CapacitorHttp plugin for CORS bypass

## Key URLs

- **Production frontend**: https://duckkine.cl
- **Production API**: https://api.duckkine.cl (Railway)
- **Dev frontend**: http://localhost:3000
- **Dev backend**: http://localhost:4000
- **WhatsApp**: +56 9 8662 5344

## Database

- **Dev**: `postgresql://mac@localhost:5432/duckkine?schema=public`
- **Prod**: Railway PostgreSQL (see Railway dashboard)
- Run migrations: `cd backend && npx prisma migrate dev --name description`
- Generate client: `cd backend && npx prisma generate`
- Reset dev DB (destructive): `cd backend && npx prisma migrate reset --force`

## WhatsApp + Claude AI Integration (NEW)

### Architecture
```
Patient WhatsApp → Meta Cloud API → POST /api/whatsapp/webhook
    → WhatsAppService.processIncoming()
    → ClaudeService.generateResponse() (with patient context)
    → WhatsAppService.sendMessage() → Meta API → Patient WhatsApp
```

### Key Files
- `backend/src/services/claude.service.js` — Claude AI with clinic system prompt (uses env.ANTHROPIC_API_KEY)
- `backend/src/services/whatsapp.service.js` — Meta Cloud API + conversation management + clinical extraction
- `backend/src/utils/aiClinicalExtractor.js` — AI extracts pain/clinical data from patient messages (uses Haiku 4.5)
- `backend/src/controllers/whatsapp.controller.js` — Webhook handler + admin endpoints
- `backend/src/routes/whatsapp.routes.js` — Public webhook + protected admin routes

### WhatsApp API Endpoints
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | /api/whatsapp/webhook | Public | Meta verification challenge |
| POST | /api/whatsapp/webhook | Public | Receive incoming messages |
| GET | /api/whatsapp/conversations | Admin/Pro | List all conversations |
| GET | /api/whatsapp/conversations/:id/messages | Admin/Pro | Chat history |
| POST | /api/whatsapp/send | Admin/Pro | Send manual message |

### Environment Variables Needed
```
WHATSAPP_PHONE_NUMBER_ID=   # From Meta Developer Console
WHATSAPP_ACCESS_TOKEN=      # From Meta Developer Console
WHATSAPP_VERIFY_TOKEN=duckkine-webhook-verify-2026
WHATSAPP_APP_SECRET=        # From Meta App Settings > Basic
ANTHROPIC_API_KEY=          # From console.anthropic.com (ROTATE - was exposed)
```

### Setup Steps (TODO)
1. Create Meta Business account at business.facebook.com
2. Create Developer app at developers.facebook.com → add WhatsApp product
3. Copy Phone Number ID, Access Token, App Secret → update backend/.env
4. Configure webhook URL: `https://api.duckkine.cl/api/whatsapp/webhook`
5. Verify token: `duckkine-webhook-verify-2026`
6. Subscribe to: `messages` field
7. Add business phone +56986625344 and verify via SMS
8. Rotate Anthropic API key at console.anthropic.com and update .env

### Prisma Models Added
- `WhatsAppConversation` — tracks conversations, links to Patient by phone
- `WhatsAppMessage` — stores all inbound/outbound messages with AI flag

### Patient Journey WhatsApp Notifications
The `patientJourney.service.js` now sends WhatsApp messages for:
- Appointment confirmations (immediate)
- 24h appointment reminders (via CRON)
- Uses `sendWhatsAppNotification()` helper method

## Backend API Routes (14 total)

| Route | File | Purpose |
|-------|------|---------|
| /api/auth | auth.routes.js | Login, register, password reset |
| /api/patients | patients.routes.js | Patient CRUD, goals, pain, exercises |
| /api/appointments | appointments.routes.js | Booking, available slots |
| /api/clinical-records | clinicalRecords.routes.js | Fichas clinicas |
| /api/payments | payments.routes.js | Webpay init/confirm, receipts |
| /api/professionals | professionals.routes.js | Professional profiles |
| /api/services | services.routes.js | Service catalog |
| /api/sports-programs | sportsPrograms.routes.js | Programs + enrollment |
| /api/training-classes | trainingClasses.routes.js | Group classes + booking |
| /api/academy | academy.routes.js | Courses + enrollment |
| /api/corporate | corporate.routes.js | Corporate plans |
| /api/franchise | franchise.routes.js | Franchise management |
| /api/admin | admin.routes.js | Dashboard stats, session management |
| /api/whatsapp | whatsapp.routes.js | WhatsApp webhook + conversations |

## Common Commands

```bash
# Backend
cd backend && npm run dev          # Start dev server (port 4000)
cd backend && npx prisma studio    # Visual database browser

# Frontend
cd frontend && npm run dev         # Start Next.js dev (port 3000)
cd frontend && npm run build       # Static export to out/
cd frontend && npx cap sync        # Sync web assets to Android
cd frontend && npx cap open android # Open in Android Studio

# Mission Control (separate)
cd mission-control-kine && pnpm dev  # Dashboard on port 3000
# Login: admin / fc358c4070d286f02762f0cea3b0bdd6
```

## Coding Conventions

- Language: JavaScript (CommonJS require/module.exports), not TypeScript
- All user-facing text in Spanish (Chilean)
- Services are classes with static methods (e.g., `ClaudeService.generateResponse()`)
- Notification service is singleton instance
- Database access via Prisma client at `require('../config/database')`
- Auth middleware: `authenticate` (JWT) + `authorize('ROLE1', 'ROLE2')`
- Validation: Zod schemas in middleware
- Error handling: centralized errorHandler middleware
- Date formatting: Chilean locale (es-CL), timezone America/Santiago

## Security Notes

- NEVER commit .env files
- API key in .env was exposed in chat — MUST be rotated
- Transbank keys in .env are integration/test keys (not production)
- JWT secret in dev is placeholder — use strong secret in production
- WhatsApp webhook signature verification uses HMAC-SHA256 (constant-time)
- Rate limiting enabled on all routes via express-rate-limit

## Mission Control (Admin Dashboard)

Separate project at `mission-control-kine/`. Uses SQLite, runs independently.
- Login: admin / fc358c4070d286f02762f0cea3b0bdd6
- Does NOT require OpenClaw gateway for basic features (task board, webhooks, users)
- Gateway WebSocket error on startup is expected and harmless
