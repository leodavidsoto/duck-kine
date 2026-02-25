-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PATIENT', 'PROFESSIONAL', 'CLINIC_DIRECTOR', 'FRANCHISE_ADMIN', 'ORG_ADMIN', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PATIENT_ABSENT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('WEBPAY', 'TRANSFER', 'CASH', 'SUBSCRIPTION', 'CORPORATE');

-- CreateEnum
CREATE TYPE "PaymentConcept" AS ENUM ('SESSION', 'SUBSCRIPTION', 'PROGRAM', 'COURSE', 'PACKAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "ProgramLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE');

-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('REHABILITATION', 'SPORTS_PERFORMANCE', 'PREVENTION', 'POST_SURGICAL', 'CHRONIC_PAIN', 'RETURN_TO_SPORT');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('BASIC', 'STANDARD', 'PREMIUM', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAUSED', 'PAST_DUE', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL');

-- CreateEnum
CREATE TYPE "CorporatePlanStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('APPOINTMENT', 'SESSION', 'PAYMENT', 'PROGRAM', 'ACADEMY', 'SUBSCRIPTION', 'PROGRESS', 'SYSTEM');

-- CreateEnum
CREATE TYPE "CourseCategory" AS ENUM ('REHABILITATION', 'SPORTS', 'WELLNESS', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('INITIAL', 'FOLLOW_UP', 'DISCHARGE', 'SPORTS_SCREENING');

-- CreateEnum
CREATE TYPE "PainLevel" AS ENUM ('NONE', 'MILD', 'MODERATE', 'SEVERE', 'EXTREME');

-- CreateEnum
CREATE TYPE "Laterality" AS ENUM ('LEFT', 'RIGHT', 'BILATERAL', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "ClinicType" AS ENUM ('PROPIA', 'FRANQUICIA');

-- CreateEnum
CREATE TYPE "ClinicStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'CLOSED', 'COMING_SOON');

-- CreateEnum
CREATE TYPE "ClinicRole" AS ENUM ('DIRECTOR', 'COORDINATOR', 'STAFF');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('TREATMENT', 'GYM', 'EVALUATION', 'HYDROTHERAPY');

-- CreateEnum
CREATE TYPE "LicenseStatus" AS ENUM ('LICENSE_PENDING', 'LICENSE_ACTIVE', 'LICENSE_SUSPENDED', 'LICENSE_TERMINATED', 'LICENSE_EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "rut" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'PATIENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "avatarUrl" TEXT,
    "defaultClinicId" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "gender" "Gender",
    "nationality" TEXT DEFAULT 'Chilena',
    "address" TEXT,
    "commune" TEXT,
    "region" TEXT DEFAULT 'Metropolitana',
    "occupation" TEXT,
    "prevision" TEXT,
    "previsionDetail" TEXT,
    "previsionNumber" TEXT,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "emergencyRelation" TEXT,
    "medicalHistory" TEXT,
    "surgicalHistory" TEXT,
    "familyHistory" TEXT,
    "allergies" TEXT,
    "medications" TEXT,
    "smokingStatus" TEXT,
    "activityLevel" TEXT,
    "sport" TEXT,
    "referralSource" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professional" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "university" TEXT,
    "yearsExperience" INTEGER,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "colorTag" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalRecord" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "reasonForVisit" TEXT,
    "currentIllness" TEXT,
    "onsetDate" TIMESTAMP(3),
    "mechanism" TEXT,
    "inspection" TEXT,
    "palpation" TEXT,
    "rangeOfMotion" JSONB,
    "muscleStrength" JSONB,
    "specialTests" JSONB,
    "neurologicalExam" TEXT,
    "functionalAssessment" TEXT,
    "diagnosis" TEXT,
    "icdCode" TEXT,
    "treatment" TEXT,
    "objectives" TEXT,
    "exercises" TEXT,
    "precautions" TEXT,
    "prognosis" TEXT,
    "bodyMap" JSONB,
    "attachments" TEXT[],
    "observations" TEXT,
    "nextSessionPlan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "clinicId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "isFirstVisit" BOOLEAN NOT NULL DEFAULT false,
    "confirmationSent" BOOLEAN NOT NULL DEFAULT false,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "cancellationReason" TEXT,
    "notes" TEXT,
    "source" TEXT NOT NULL DEFAULT 'web',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "clinicalRecordId" TEXT,
    "clinicId" TEXT,
    "roomId" TEXT,
    "sessionNumber" INTEGER NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "actualStartTime" TIMESTAMP(3),
    "actualEndTime" TIMESTAMP(3),
    "durationMinutes" INTEGER,
    "techniques" JSONB,
    "exercisesPerformed" JSONB,
    "modalities" TEXT[],
    "painBefore" INTEGER,
    "painAfter" INTEGER,
    "patientFeedback" TEXT,
    "observations" TEXT,
    "homeExercises" TEXT,
    "recommendations" TEXT,
    "nextSessionGoal" TEXT,
    "progressRating" INTEGER,
    "progressNotes" TEXT,
    "attachments" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "clinicId" TEXT,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "breakStart" TEXT,
    "breakEnd" TEXT,
    "slotDuration" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requiresReferral" BOOLEAN NOT NULL DEFAULT false,
    "maxSessionsPackage" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "subscriptionId" TEXT,
    "clinicId" TEXT,
    "concept" "PaymentConcept" NOT NULL DEFAULT 'SESSION',
    "description" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL DEFAULT 'WEBPAY',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "webpayToken" TEXT,
    "authorizationCode" TEXT,
    "cardLastFour" TEXT,
    "receiptNumber" TEXT,
    "receiptUrl" TEXT,
    "refundAmount" DECIMAL(10,2),
    "refundReason" TEXT,
    "metadata" JSONB,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlanTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'BASIC',
    "description" TEXT,
    "sessionsPerMonth" INTEGER NOT NULL,
    "priceMonthly" DECIMAL(10,2) NOT NULL,
    "priceQuarterly" DECIMAL(10,2),
    "priceSemiAnnual" DECIMAL(10,2),
    "priceAnnual" DECIMAL(10,2),
    "includesAssessment" BOOLEAN NOT NULL DEFAULT false,
    "includesProgram" BOOLEAN NOT NULL DEFAULT false,
    "discountPercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "features" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPlanTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlanService" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "SubscriptionPlanService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "planTemplateId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "billingCycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY',
    "currentPrice" DECIMAL(10,2) NOT NULL,
    "sessionsRemaining" INTEGER NOT NULL,
    "sessionsUsed" INTEGER NOT NULL DEFAULT 0,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "trialEndsAt" TIMESTAMP(3),
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "nextBillingDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportsProgram" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sport" TEXT NOT NULL,
    "type" "ProgramType" NOT NULL DEFAULT 'SPORTS_PERFORMANCE',
    "level" "ProgramLevel" NOT NULL DEFAULT 'BEGINNER',
    "durationWeeks" INTEGER NOT NULL,
    "sessionsPerWeek" INTEGER NOT NULL DEFAULT 3,
    "price" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT,
    "objectives" TEXT[],
    "prerequisites" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SportsProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramPhase" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weekStart" INTEGER NOT NULL,
    "weekEnd" INTEGER NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "objectives" TEXT[],
    "exercises" JSONB,

    CONSTRAINT "ProgramPhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportsProgramEnrollment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "currentWeek" INTEGER NOT NULL DEFAULT 1,
    "currentPhase" TEXT,
    "completionPercentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "progressData" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SportsProgramEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicalAssessment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "type" "AssessmentType" NOT NULL DEFAULT 'INITIAL',
    "assessmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postureAnalysis" JSONB,
    "postureImages" TEXT[],
    "rangeOfMotion" JSONB,
    "muscleStrength" JSONB,
    "flexibility" JSONB,
    "balance" JSONB,
    "cardioAssessment" JSONB,
    "overallScore" DECIMAL(5,2),
    "summary" TEXT,
    "recommendations" TEXT,
    "comparedTo" TEXT,
    "attachments" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhysicalAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyMetrics" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weightKg" DECIMAL(5,2),
    "heightCm" DECIMAL(5,1),
    "bmi" DECIMAL(4,2),
    "bodyFatPercent" DECIMAL(4,2),
    "muscleMassKg" DECIMAL(5,2),
    "waistCircumference" DECIMAL(5,1),
    "hipCircumference" DECIMAL(5,1),
    "chestCircumference" DECIMAL(5,1),
    "armCircumferenceL" DECIMAL(5,1),
    "armCircumferenceR" DECIMAL(5,1),
    "thighCircumferenceL" DECIMAL(5,1),
    "thighCircumferenceR" DECIMAL(5,1),
    "calfCircumferenceL" DECIMAL(5,1),
    "calfCircumferenceR" DECIMAL(5,1),
    "restingHeartRate" INTEGER,
    "bloodPressureSystolic" INTEGER,
    "bloodPressureDiastolic" INTEGER,
    "notes" TEXT,
    "measuredBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BodyMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FunctionalTest" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "testName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "laterality" "Laterality" NOT NULL DEFAULT 'NOT_APPLICABLE',
    "normalMin" DECIMAL(10,2),
    "normalMax" DECIMAL(10,2),
    "percentile" INTEGER,
    "notes" TEXT,
    "measuredBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FunctionalTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PainRecord" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT NOT NULL,
    "painLevel" "PainLevel" NOT NULL,
    "evaScore" INTEGER NOT NULL,
    "laterality" "Laterality" NOT NULL DEFAULT 'NOT_APPLICABLE',
    "context" TEXT,
    "triggers" TEXT,
    "relievers" TEXT,
    "notes" TEXT,
    "bodyMapData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PainRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreatmentGoal" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetValue" TEXT,
    "currentValue" TEXT,
    "category" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "targetDate" TIMESTAMP(3),
    "achievedDate" TIMESTAMP(3),
    "isAchieved" BOOLEAN NOT NULL DEFAULT false,
    "progressPercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "milestones" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreatmentGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructor" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "thumbnailUrl" TEXT,
    "category" "CourseCategory" NOT NULL DEFAULT 'REHABILITATION',
    "totalLessons" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "videoUrl" TEXT,
    "durationMinutes" INTEGER NOT NULL DEFAULT 0,
    "orderIndex" INTEGER NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseEnrollment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "completedLessons" INTEGER NOT NULL DEFAULT 0,
    "progress" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "certificateIssued" BOOLEAN NOT NULL DEFAULT false,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorporateClient" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "rut" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "employeeCount" INTEGER NOT NULL DEFAULT 0,
    "industry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorporateClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorporatePlan" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "sessionsPerMonth" INTEGER NOT NULL,
    "monthlyPrice" DECIMAL(10,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "CorporatePlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorporatePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rut" TEXT NOT NULL,
    "legalName" TEXT,
    "logo" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinic" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ClinicType" NOT NULL DEFAULT 'PROPIA',
    "status" "ClinicStatus" NOT NULL DEFAULT 'ACTIVE',
    "address" TEXT NOT NULL,
    "commune" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Chile',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "googleMapsUrl" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'America/Santiago',
    "currency" TEXT NOT NULL DEFAULT 'CLP',
    "openingTime" TEXT NOT NULL DEFAULT '08:00',
    "closingTime" TEXT NOT NULL DEFAULT '20:00',
    "workDays" INTEGER[] DEFAULT ARRAY[1, 2, 3, 4, 5]::INTEGER[],
    "maxConcurrentAppointments" INTEGER NOT NULL DEFAULT 5,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "customLogo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicRoom" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RoomType" NOT NULL DEFAULT 'TREATMENT',
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "equipment" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ClinicRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicProfessional" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "role" "ClinicRole" NOT NULL DEFAULT 'STAFF',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "ClinicProfessional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicService" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "localPrice" INTEGER,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ClinicService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FranchiseLicense" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "franchiseeName" TEXT NOT NULL,
    "franchiseeRut" TEXT NOT NULL,
    "franchiseeEmail" TEXT NOT NULL,
    "franchiseePhone" TEXT NOT NULL,
    "contractStart" TIMESTAMP(3) NOT NULL,
    "contractEnd" TIMESTAMP(3) NOT NULL,
    "renewalDate" TIMESTAMP(3),
    "status" "LicenseStatus" NOT NULL DEFAULT 'LICENSE_ACTIVE',
    "monthlyFee" INTEGER NOT NULL,
    "revenueSharePct" DOUBLE PRECISION NOT NULL DEFAULT 0.08,
    "initialInvestment" INTEGER,
    "exclusiveTerritory" TEXT,
    "territoryRadius" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FranchiseLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FranchisePayment" (
    "id" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "fixedFee" INTEGER NOT NULL,
    "revenueBase" INTEGER NOT NULL,
    "revenueShare" INTEGER NOT NULL,
    "totalDue" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FranchisePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicMetricsSnapshot" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "totalPatients" INTEGER NOT NULL,
    "newPatients" INTEGER NOT NULL,
    "totalAppointments" INTEGER NOT NULL,
    "completedSessions" INTEGER NOT NULL,
    "noShowRate" DOUBLE PRECISION NOT NULL,
    "averageSatisfaction" DOUBLE PRECISION,
    "totalRevenue" INTEGER NOT NULL,
    "topServices" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicMetricsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_rut_key" ON "User"("rut");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_rut_idx" ON "User"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- CreateIndex
CREATE INDEX "Patient_userId_idx" ON "Patient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_userId_key" ON "Professional"("userId");

-- CreateIndex
CREATE INDEX "Professional_userId_idx" ON "Professional"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalRecord_appointmentId_key" ON "ClinicalRecord"("appointmentId");

-- CreateIndex
CREATE INDEX "ClinicalRecord_patientId_idx" ON "ClinicalRecord"("patientId");

-- CreateIndex
CREATE INDEX "ClinicalRecord_professionalId_idx" ON "ClinicalRecord"("professionalId");

-- CreateIndex
CREATE INDEX "ClinicalRecord_createdAt_idx" ON "ClinicalRecord"("createdAt");

-- CreateIndex
CREATE INDEX "Appointment_patientId_idx" ON "Appointment"("patientId");

-- CreateIndex
CREATE INDEX "Appointment_professionalId_idx" ON "Appointment"("professionalId");

-- CreateIndex
CREATE INDEX "Appointment_startTime_idx" ON "Appointment"("startTime");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE INDEX "Appointment_clinicId_idx" ON "Appointment"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_appointmentId_key" ON "Session"("appointmentId");

-- CreateIndex
CREATE INDEX "Session_patientId_idx" ON "Session"("patientId");

-- CreateIndex
CREATE INDEX "Session_professionalId_idx" ON "Session"("professionalId");

-- CreateIndex
CREATE INDEX "Session_clinicalRecordId_idx" ON "Session"("clinicalRecordId");

-- CreateIndex
CREATE INDEX "Session_clinicId_idx" ON "Session"("clinicId");

-- CreateIndex
CREATE INDEX "Session_createdAt_idx" ON "Session"("createdAt");

-- CreateIndex
CREATE INDEX "Schedule_professionalId_idx" ON "Schedule"("professionalId");

-- CreateIndex
CREATE INDEX "Schedule_clinicId_idx" ON "Schedule"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_professionalId_dayOfWeek_clinicId_key" ON "Schedule"("professionalId", "dayOfWeek", "clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_appointmentId_key" ON "Payment"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_receiptNumber_key" ON "Payment"("receiptNumber");

-- CreateIndex
CREATE INDEX "Payment_patientId_idx" ON "Payment"("patientId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- CreateIndex
CREATE INDEX "Payment_concept_idx" ON "Payment"("concept");

-- CreateIndex
CREATE INDEX "Payment_clinicId_idx" ON "Payment"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlanTemplate_name_key" ON "SubscriptionPlanTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlanService_planId_serviceId_key" ON "SubscriptionPlanService"("planId", "serviceId");

-- CreateIndex
CREATE INDEX "Subscription_patientId_idx" ON "Subscription"("patientId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Subscription_periodEnd_idx" ON "Subscription"("periodEnd");

-- CreateIndex
CREATE INDEX "ProgramPhase_programId_idx" ON "ProgramPhase"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramPhase_programId_orderIndex_key" ON "ProgramPhase"("programId", "orderIndex");

-- CreateIndex
CREATE INDEX "SportsProgramEnrollment_patientId_idx" ON "SportsProgramEnrollment"("patientId");

-- CreateIndex
CREATE INDEX "SportsProgramEnrollment_programId_idx" ON "SportsProgramEnrollment"("programId");

-- CreateIndex
CREATE INDEX "SportsProgramEnrollment_status_idx" ON "SportsProgramEnrollment"("status");

-- CreateIndex
CREATE INDEX "PhysicalAssessment_patientId_idx" ON "PhysicalAssessment"("patientId");

-- CreateIndex
CREATE INDEX "PhysicalAssessment_assessmentDate_idx" ON "PhysicalAssessment"("assessmentDate");

-- CreateIndex
CREATE INDEX "PhysicalAssessment_type_idx" ON "PhysicalAssessment"("type");

-- CreateIndex
CREATE INDEX "BodyMetrics_patientId_idx" ON "BodyMetrics"("patientId");

-- CreateIndex
CREATE INDEX "BodyMetrics_measuredAt_idx" ON "BodyMetrics"("measuredAt");

-- CreateIndex
CREATE INDEX "FunctionalTest_patientId_idx" ON "FunctionalTest"("patientId");

-- CreateIndex
CREATE INDEX "FunctionalTest_testName_idx" ON "FunctionalTest"("testName");

-- CreateIndex
CREATE INDEX "FunctionalTest_testDate_idx" ON "FunctionalTest"("testDate");

-- CreateIndex
CREATE INDEX "PainRecord_patientId_idx" ON "PainRecord"("patientId");

-- CreateIndex
CREATE INDEX "PainRecord_recordedAt_idx" ON "PainRecord"("recordedAt");

-- CreateIndex
CREATE INDEX "PainRecord_location_idx" ON "PainRecord"("location");

-- CreateIndex
CREATE INDEX "TreatmentGoal_patientId_idx" ON "TreatmentGoal"("patientId");

-- CreateIndex
CREATE INDEX "TreatmentGoal_isAchieved_idx" ON "TreatmentGoal"("isAchieved");

-- CreateIndex
CREATE INDEX "Lesson_courseId_idx" ON "Lesson"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_courseId_orderIndex_key" ON "Lesson"("courseId", "orderIndex");

-- CreateIndex
CREATE INDEX "CourseEnrollment_patientId_idx" ON "CourseEnrollment"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseEnrollment_patientId_courseId_key" ON "CourseEnrollment"("patientId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CorporateClient_rut_key" ON "CorporateClient"("rut");

-- CreateIndex
CREATE INDEX "CorporatePlan_clientId_idx" ON "CorporatePlan"("clientId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_rut_key" ON "Organization"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_slug_key" ON "Clinic"("slug");

-- CreateIndex
CREATE INDEX "Clinic_organizationId_idx" ON "Clinic"("organizationId");

-- CreateIndex
CREATE INDEX "Clinic_slug_idx" ON "Clinic"("slug");

-- CreateIndex
CREATE INDEX "Clinic_commune_city_idx" ON "Clinic"("commune", "city");

-- CreateIndex
CREATE INDEX "ClinicRoom_clinicId_idx" ON "ClinicRoom"("clinicId");

-- CreateIndex
CREATE INDEX "ClinicProfessional_clinicId_idx" ON "ClinicProfessional"("clinicId");

-- CreateIndex
CREATE INDEX "ClinicProfessional_professionalId_idx" ON "ClinicProfessional"("professionalId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicProfessional_clinicId_professionalId_key" ON "ClinicProfessional"("clinicId", "professionalId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicService_clinicId_serviceId_key" ON "ClinicService"("clinicId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "FranchiseLicense_clinicId_key" ON "FranchiseLicense"("clinicId");

-- CreateIndex
CREATE INDEX "FranchiseLicense_organizationId_idx" ON "FranchiseLicense"("organizationId");

-- CreateIndex
CREATE INDEX "FranchisePayment_licenseId_idx" ON "FranchisePayment"("licenseId");

-- CreateIndex
CREATE UNIQUE INDEX "FranchisePayment_licenseId_period_key" ON "FranchisePayment"("licenseId", "period");

-- CreateIndex
CREATE INDEX "ClinicMetricsSnapshot_clinicId_idx" ON "ClinicMetricsSnapshot"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicMetricsSnapshot_clinicId_period_key" ON "ClinicMetricsSnapshot"("clinicId", "period");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalRecord" ADD CONSTRAINT "ClinicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalRecord" ADD CONSTRAINT "ClinicalRecord_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalRecord" ADD CONSTRAINT "ClinicalRecord_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_clinicalRecordId_fkey" FOREIGN KEY ("clinicalRecordId") REFERENCES "ClinicalRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPlanService" ADD CONSTRAINT "SubscriptionPlanService_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlanTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPlanService" ADD CONSTRAINT "SubscriptionPlanService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planTemplateId_fkey" FOREIGN KEY ("planTemplateId") REFERENCES "SubscriptionPlanTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramPhase" ADD CONSTRAINT "ProgramPhase_programId_fkey" FOREIGN KEY ("programId") REFERENCES "SportsProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportsProgramEnrollment" ADD CONSTRAINT "SportsProgramEnrollment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportsProgramEnrollment" ADD CONSTRAINT "SportsProgramEnrollment_programId_fkey" FOREIGN KEY ("programId") REFERENCES "SportsProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalAssessment" ADD CONSTRAINT "PhysicalAssessment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalAssessment" ADD CONSTRAINT "PhysicalAssessment_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BodyMetrics" ADD CONSTRAINT "BodyMetrics_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FunctionalTest" ADD CONSTRAINT "FunctionalTest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PainRecord" ADD CONSTRAINT "PainRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentGoal" ADD CONSTRAINT "TreatmentGoal_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorporatePlan" ADD CONSTRAINT "CorporatePlan_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "CorporateClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clinic" ADD CONSTRAINT "Clinic_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicRoom" ADD CONSTRAINT "ClinicRoom_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicProfessional" ADD CONSTRAINT "ClinicProfessional_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicProfessional" ADD CONSTRAINT "ClinicProfessional_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicService" ADD CONSTRAINT "ClinicService_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicService" ADD CONSTRAINT "ClinicService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FranchiseLicense" ADD CONSTRAINT "FranchiseLicense_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FranchiseLicense" ADD CONSTRAINT "FranchiseLicense_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FranchisePayment" ADD CONSTRAINT "FranchisePayment_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "FranchiseLicense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
