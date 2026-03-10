-- CreateEnum
CREATE TYPE "ClassBookingStatus" AS ENUM ('BOOKED', 'CONFIRMED', 'CANCELLED', 'ATTENDED');

-- CreateEnum
CREATE TYPE "WhatsAppConversationStatus" AS ENUM ('ACTIVE', 'CLOSED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "WhatsAppMessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateTable
CREATE TABLE "TrainingClass" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 15,
    "trainerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassBooking" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "status" "ClassBookingStatus" NOT NULL DEFAULT 'BOOKED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppConversation" (
    "id" TEXT NOT NULL,
    "waId" TEXT NOT NULL,
    "patientId" TEXT,
    "contactName" TEXT,
    "status" "WhatsAppConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "context" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "waMessageId" TEXT,
    "direction" "WhatsAppMessageDirection" NOT NULL,
    "body" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "mediaType" TEXT,
    "status" TEXT,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsAppMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrainingClass_startTime_idx" ON "TrainingClass"("startTime");

-- CreateIndex
CREATE INDEX "TrainingClass_trainerId_idx" ON "TrainingClass"("trainerId");

-- CreateIndex
CREATE INDEX "ClassBooking_patientId_idx" ON "ClassBooking"("patientId");

-- CreateIndex
CREATE INDEX "ClassBooking_status_idx" ON "ClassBooking"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ClassBooking_classId_patientId_key" ON "ClassBooking"("classId", "patientId");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppConversation_waId_key" ON "WhatsAppConversation"("waId");

-- CreateIndex
CREATE INDEX "WhatsAppConversation_waId_idx" ON "WhatsAppConversation"("waId");

-- CreateIndex
CREATE INDEX "WhatsAppConversation_patientId_idx" ON "WhatsAppConversation"("patientId");

-- CreateIndex
CREATE INDEX "WhatsAppConversation_lastMessageAt_idx" ON "WhatsAppConversation"("lastMessageAt");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppMessage_waMessageId_key" ON "WhatsAppMessage"("waMessageId");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_conversationId_idx" ON "WhatsAppMessage"("conversationId");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_createdAt_idx" ON "WhatsAppMessage"("createdAt");

-- AddForeignKey
ALTER TABLE "TrainingClass" ADD CONSTRAINT "TrainingClass_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Professional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassBooking" ADD CONSTRAINT "ClassBooking_classId_fkey" FOREIGN KEY ("classId") REFERENCES "TrainingClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassBooking" ADD CONSTRAINT "ClassBooking_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppConversation" ADD CONSTRAINT "WhatsAppConversation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppMessage" ADD CONSTRAINT "WhatsAppMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "WhatsAppConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
