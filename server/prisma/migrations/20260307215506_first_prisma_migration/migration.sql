-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('Simple', 'Google', 'LinkedIn');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('FORM_FILLED', 'FORM_PARTIAL_FILL');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('marketing', 'promotions', 'sales', 'updates');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT DEFAULT 'https://res.cloudinary.com/dioiyots5/bluey_2_jvigye.webp',
    "company" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthType" (
    "id" TEXT NOT NULL,
    "provider" "AccountType" NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AuthType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "uniqueId" TEXT,
    "company" TEXT,
    "designation" TEXT,
    "avatar" TEXT NOT NULL DEFAULT 'data.png',
    "extendedTrial" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "customerId" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "loginType" "AccountType" NOT NULL DEFAULT 'Simple',
    "loggedOutAt" TIMESTAMP(3),
    "lastActive" TIMESTAMP(3),
    "authorized" BOOLEAN NOT NULL DEFAULT true,
    "userAgent" TEXT,
    "platform" TEXT,
    "language" TEXT,
    "ip" TEXT,
    "network" TEXT,
    "ip_version" TEXT,
    "region_code" TEXT,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT,
    "country_code" TEXT,
    "country_code_iso3" TEXT,
    "continent_code" TEXT,
    "postal" TEXT,
    "timezone" TEXT,
    "location" TEXT,
    "utc_offset" TEXT,
    "asn" TEXT,
    "network_provider" TEXT,
    "browser" TEXT,
    "browserVersion" TEXT,
    "os" TEXT,
    "osVersion" TEXT,
    "deviceType" TEXT,
    "deviceVendor" TEXT,
    "deviceModel" TEXT,
    "cpuArch" TEXT,
    "screenSize" TEXT,
    "pixelRatio" DOUBLE PRECISION,
    "isTouchDevice" BOOLEAN,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "trackingId" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notificationUser" TEXT NOT NULL,
    "notificationEmail" TEXT NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pageUrl" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "formName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldsInfo" (
    "id" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "formId" TEXT,
    "externalFormId" TEXT,
    "sessionTime" TEXT,
    "field" TEXT,

    CONSTRAINT "FieldsInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "externalFormId" TEXT,
    "sessionTime" DOUBLE PRECISION,
    "opportunityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "conversion" BOOLEAN NOT NULL DEFAULT false,
    "referral" TEXT,
    "opportunityGeo" JSONB,
    "ipAddress" TEXT,
    "country" TEXT,
    "formData" JSONB NOT NULL,
    "utm_Params" JSONB,
    "websiteId" TEXT NOT NULL,
    "timeSpendOnForm" DOUBLE PRECISION,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunityFormFills" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "timeSpendOnThis" DOUBLE PRECISION,

    CONSTRAINT "OpportunityFormFills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceInfo" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "browser" TEXT,
    "os" TEXT,
    "deviceType" TEXT,
    "otherData" JSONB,

    CONSTRAINT "DeviceInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadInfo" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "lastFieldFilled" TEXT NOT NULL,
    "timeSpent" DOUBLE PRECISION,

    CONSTRAINT "LeadInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldTimeSpent" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "timeSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FieldTimeSpent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValueChange" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentTime" TEXT,
    "opportunityId" TEXT NOT NULL,

    CONSTRAINT "ValueChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "formId" TEXT,
    "externalFormId" TEXT,
    "leadId" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "device" JSONB,
    "browser" TEXT,
    "pinCode" TEXT,
    "geo" JSONB,
    "region" TEXT,
    "os" TEXT,
    "action" "ActionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForgetPassword" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "passwordResetToken" TEXT NOT NULL,
    "passwordExpiry" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForgetPassword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalForm" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "formType" TEXT NOT NULL,
    "formName" TEXT NOT NULL,
    "formUrl" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "trackingScript" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ExternalForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "category" "NotificationCategory" NOT NULL,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationCategory" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserNotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "AuthType_userId_idx" ON "AuthType"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthType_provider_providerId_key" ON "AuthType"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "UserData_userId_key" ON "UserData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserData_uniqueId_key" ON "UserData"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_sessionId_idx" ON "RefreshToken"("sessionId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Website_uniqueId_key" ON "Website"("uniqueId");

-- CreateIndex
CREATE INDEX "Website_userId_idx" ON "Website"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Form_uniqueId_key" ON "Form"("uniqueId");

-- CreateIndex
CREATE INDEX "Form_websiteId_idx" ON "Form"("websiteId");

-- CreateIndex
CREATE UNIQUE INDEX "Form_websiteId_pageUrl_key" ON "Form"("websiteId", "pageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "FieldsInfo_uniqueId_key" ON "FieldsInfo"("uniqueId");

-- CreateIndex
CREATE INDEX "FieldsInfo_externalFormId_idx" ON "FieldsInfo"("externalFormId");

-- CreateIndex
CREATE UNIQUE INDEX "FieldsInfo_formId_field_key" ON "FieldsInfo"("formId", "field");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_uniqueId_key" ON "Lead"("uniqueId");

-- CreateIndex
CREATE INDEX "Lead_externalFormId_idx" ON "Lead"("externalFormId");

-- CreateIndex
CREATE INDEX "Lead_formId_idx" ON "Lead"("formId");

-- CreateIndex
CREATE INDEX "Lead_websiteId_idx" ON "Lead"("websiteId");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_formId_opportunityId_key" ON "Lead"("formId", "opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "OpportunityFormFills_leadId_field_key" ON "OpportunityFormFills"("leadId", "field");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceInfo_leadId_key" ON "DeviceInfo"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "LeadInfo_leadId_key" ON "LeadInfo"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "FieldTimeSpent_leadId_fieldName_key" ON "FieldTimeSpent"("leadId", "fieldName");

-- CreateIndex
CREATE INDEX "ValueChange_leadId_idx" ON "ValueChange"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Analytics_leadId_key" ON "Analytics"("leadId");

-- CreateIndex
CREATE INDEX "Analytics_externalFormId_idx" ON "Analytics"("externalFormId");

-- CreateIndex
CREATE INDEX "Analytics_formId_idx" ON "Analytics"("formId");

-- CreateIndex
CREATE INDEX "Analytics_websiteId_idx" ON "Analytics"("websiteId");

-- CreateIndex
CREATE UNIQUE INDEX "ForgetPassword_userId_key" ON "ForgetPassword"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ForgetPassword_passwordResetToken_key" ON "ForgetPassword"("passwordResetToken");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalForm_uniqueId_key" ON "ExternalForm"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalForm_trackingScript_key" ON "ExternalForm"("trackingScript");

-- CreateIndex
CREATE INDEX "ExternalForm_userId_idx" ON "ExternalForm"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_uniqueId_key" ON "Notification"("uniqueId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "UserNotification_notificationId_idx" ON "UserNotification"("notificationId");

-- CreateIndex
CREATE INDEX "UserNotification_userId_idx" ON "UserNotification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserNotificationPreference_userId_type_key" ON "UserNotificationPreference"("userId", "type");

-- AddForeignKey
ALTER TABLE "AuthType" ADD CONSTRAINT "AuthType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserData" ADD CONSTRAINT "UserData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldsInfo" ADD CONSTRAINT "FieldsInfo_externalFormId_fkey" FOREIGN KEY ("externalFormId") REFERENCES "ExternalForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldsInfo" ADD CONSTRAINT "FieldsInfo_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_externalFormId_fkey" FOREIGN KEY ("externalFormId") REFERENCES "ExternalForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityFormFills" ADD CONSTRAINT "OpportunityFormFills_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceInfo" ADD CONSTRAINT "DeviceInfo_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadInfo" ADD CONSTRAINT "LeadInfo_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldTimeSpent" ADD CONSTRAINT "FieldTimeSpent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValueChange" ADD CONSTRAINT "ValueChange_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_externalFormId_fkey" FOREIGN KEY ("externalFormId") REFERENCES "ExternalForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForgetPassword" ADD CONSTRAINT "ForgetPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalForm" ADD CONSTRAINT "ExternalForm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotificationPreference" ADD CONSTRAINT "UserNotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
