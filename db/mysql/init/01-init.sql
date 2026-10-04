CREATE DATABASE IF NOT EXISTS `soulcut_saas_core_service` DEFAULT CHARACTER
SET
    utf8mb4 DEFAULT COLLATE utf8mb4_general_ci;

USE `soulcut_saas_core_service`;

-- ============================================================
-- User table
-- Extended with profile, locale, account meta, and audit fields.
-- ============================================================
CREATE TABLE
    IF NOT EXISTS `t_user_info` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
        `username` VARCHAR(64) NOT NULL COMMENT 'Username',
        `password` VARCHAR(255) NOT NULL COMMENT 'Password (bcrypt hash)',
        `nickname` VARCHAR(64) DEFAULT NULL COMMENT 'Nickname',
        `email` VARCHAR(128) DEFAULT NULL COMMENT 'Email',
        `phone` VARCHAR(20) DEFAULT NULL COMMENT 'Phone number',
        -- ----- Profile -----
        `avatar` VARCHAR(512) DEFAULT NULL COMMENT 'Avatar URL',
        `wallpaper` VARCHAR(512) DEFAULT NULL COMMENT 'Profile wallpaper URL',
        `gender` TINYINT NOT NULL DEFAULT 0 COMMENT 'Gender: 0-unknown 1-male 2-female 3-other',
        `birthday` DATE DEFAULT NULL COMMENT 'Birthday',
        `signature` VARCHAR(255) DEFAULT NULL COMMENT 'Personal signature / bio',
        `real_name` VARCHAR(64) DEFAULT NULL COMMENT 'Real name',
        `id_card_no` VARCHAR(64) DEFAULT NULL COMMENT 'ID card number (encrypted)',
        -- ----- Locale -----
        `country` VARCHAR(64) DEFAULT NULL COMMENT 'Country',
        `province` VARCHAR(64) DEFAULT NULL COMMENT 'Province / state',
        `city` VARCHAR(64) DEFAULT NULL COMMENT 'City',
        `address` VARCHAR(255) DEFAULT NULL COMMENT 'Full address',
        `language` VARCHAR(16) NOT NULL DEFAULT 'zh-CN' COMMENT 'Preferred language, e.g. zh-CN / en-US',
        `timezone` VARCHAR(64) NOT NULL DEFAULT 'Asia/Shanghai' COMMENT 'Preferred timezone',
        -- ----- Account meta -----
        `source` VARCHAR(32) DEFAULT NULL COMMENT 'Registration source: web / tauri / ios / android / admin',
        `email_verified` TINYINT NOT NULL DEFAULT 0 COMMENT 'Email verified: 0-no 1-yes',
        `phone_verified` TINYINT NOT NULL DEFAULT 0 COMMENT 'Phone verified: 0-no 1-yes',
        `last_login_time` DATETIME DEFAULT NULL COMMENT 'Last login time',
        `last_login_ip` VARCHAR(64) DEFAULT NULL COMMENT 'Last login IP',
        -- ----- Status & audit -----
        `status` TINYINT NOT NULL DEFAULT 1 COMMENT 'Status: 0-disabled 1-enabled',
        `is_deleted` TINYINT NOT NULL DEFAULT 0 COMMENT 'Soft delete: 0-no 1-yes',
        `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create time',
        `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update time',
        PRIMARY KEY (`id`),
        UNIQUE KEY `uk_username` (`username`),
        UNIQUE KEY `uk_email` (`email`),
        UNIQUE KEY `uk_phone` (`phone`),
        KEY `idx_status` (`status`),
        KEY `idx_is_deleted` (`is_deleted`),
        KEY `idx_create_time` (`create_time`),
        KEY `idx_last_login_time` (`last_login_time`),
        KEY `idx_source` (`source`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'User table';

-- ============================================================
-- Tenant table
-- A tenant represents a company / customer in the SaaS system.
-- No foreign keys are used; all relations are stored in separate
-- binding tables (atomic tables only).
-- ============================================================
CREATE TABLE
    IF NOT EXISTS `t_tenant_info` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
        `name` VARCHAR(128) NOT NULL COMMENT 'Tenant name',
        `code` VARCHAR(64) NOT NULL COMMENT 'Tenant unique code',
        `contact` VARCHAR(64) DEFAULT NULL COMMENT 'Contact person',
        `phone` VARCHAR(20) DEFAULT NULL COMMENT 'Contact phone',
        `status` TINYINT NOT NULL DEFAULT 1 COMMENT 'Status: 0-disabled 1-enabled',
        `plan_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Current plan id (reference only)',
        `expire_time` DATETIME DEFAULT NULL COMMENT 'Expire time',
        `is_deleted` TINYINT NOT NULL DEFAULT 0 COMMENT 'Soft delete: 0-no 1-yes',
        `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create time',
        `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update time',
        PRIMARY KEY (`id`),
        UNIQUE KEY `uk_code` (`code`),
        KEY `idx_status` (`status`),
        KEY `idx_is_deleted` (`is_deleted`),
        KEY `idx_expire_time` (`expire_time`),
        KEY `idx_create_time` (`create_time`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Tenant table';

-- ============================================================
-- Tenant-User relation table
-- A user can belong to multiple tenants, and a tenant can have
-- multiple users. Owner flag marks the tenant creator.
-- ============================================================
CREATE TABLE
    IF NOT EXISTS `t_tenant_user` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
        `tenant_id` BIGINT UNSIGNED NOT NULL COMMENT 'Tenant id',
        `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'User id',
        `is_owner` TINYINT NOT NULL DEFAULT 0 COMMENT 'Is tenant owner: 0-no 1-yes',
        `status` TINYINT NOT NULL DEFAULT 1 COMMENT 'Status: 0-disabled 1-enabled',
        `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create time',
        `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update time',
        PRIMARY KEY (`id`),
        UNIQUE KEY `uk_tenant_user` (`tenant_id`, `user_id`),
        KEY `idx_user_id` (`user_id`),
        KEY `idx_tenant_owner` (`tenant_id`, `is_owner`),
        KEY `idx_tenant_status` (`tenant_id`, `status`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Tenant-user relation table';

-- ============================================================
-- User role table
-- tenant_id = 0 means system built-in role (shared by all tenants).
-- tenant_id > 0 means tenant-customized role.
-- ============================================================
CREATE TABLE
    IF NOT EXISTS `t_user_role_info` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
        `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Tenant id, 0 = system built-in',
        `name` VARCHAR(64) NOT NULL COMMENT 'Role name',
        `code` VARCHAR(64) NOT NULL COMMENT 'Role code',
        `description` VARCHAR(255) DEFAULT NULL COMMENT 'Role description',
        `is_system` TINYINT NOT NULL DEFAULT 0 COMMENT 'Is system role: 0-no 1-yes',
        `status` TINYINT NOT NULL DEFAULT 1 COMMENT 'Status: 0-disabled 1-enabled',
        `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create time',
        `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update time',
        PRIMARY KEY (`id`),
        UNIQUE KEY `uk_tenant_code` (`tenant_id`, `code`),
        KEY `idx_tenant_id` (`tenant_id`),
        KEY `idx_tenant_status` (`tenant_id`, `status`),
        KEY `idx_is_system` (`is_system`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'User role table';

-- ============================================================
-- User role relation table
-- Binds a user to a role, scoped by tenant.
-- One user can hold multiple roles inside the same tenant.
-- ============================================================
CREATE TABLE
    IF NOT EXISTS `t_user_role_relation` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
        `tenant_id` BIGINT UNSIGNED NOT NULL COMMENT 'Tenant id',
        `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'User id',
        `role_id` BIGINT UNSIGNED NOT NULL COMMENT 'Role id',
        `status` TINYINT NOT NULL DEFAULT 1 COMMENT 'Status: 0-disabled 1-enabled',
        `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create time',
        `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update time',
        PRIMARY KEY (`id`),
        UNIQUE KEY `uk_tenant_user_role` (`tenant_id`, `user_id`, `role_id`),
        KEY `idx_user_id` (`user_id`),
        KEY `idx_role_id` (`role_id`),
        KEY `idx_tenant_user_status` (`tenant_id`, `user_id`, `status`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'User role relation table';

-- ============================================================
-- User LLM usage table
-- One row = one LLM call made by a user (raw log, not aggregated).
--
-- Provider code and model id are stored as plain strings, aligned
-- with the langhub catalog. `kind` matches langhub's model kinds
-- (chat / image / video / audio).
--
-- `usage_type` distinguishes token directions for chat models:
--   input / output. It is NULL for models that do not split tokens
--   (image / video / audio).
-- No foreign keys are used, consistent with the rest of the schema.
-- ============================================================
CREATE TABLE
    IF NOT EXISTS `t_user_llm_usage` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
        `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'User id',
        `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Tenant id, 0 = personal / no tenant',
        `kind` VARCHAR(16) NOT NULL DEFAULT 'chat' COMMENT 'Model kind: chat / image / video / audio',
        `provider_code` VARCHAR(64) NOT NULL COMMENT 'Provider code, e.g. openai / anthropic',
        `model_id` VARCHAR(128) NOT NULL COMMENT 'Model id, e.g. gpt-4o',
        `tokens` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Token count for this call',
        `usage_type` VARCHAR(16) DEFAULT NULL COMMENT 'Token direction for chat: input / output; NULL otherwise',
        `duration_ms` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Call duration in milliseconds, 0 = unknown',
        `success` TINYINT NOT NULL DEFAULT 1 COMMENT 'Call succeeded: 0-no 1-yes',
        `request_id` VARCHAR(64) DEFAULT NULL COMMENT 'Upstream request id, for tracing',
        `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Call time',
        PRIMARY KEY (`id`),
        KEY `idx_user_time` (`user_id`, `created_at`),
        KEY `idx_tenant_time` (`tenant_id`, `created_at`),
        KEY `idx_kind_time` (`kind`, `created_at`),
        KEY `idx_provider_model` (`provider_code`, `model_id`),
        KEY `idx_usage_type` (`usage_type`),
        KEY `idx_created_at` (`created_at`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'User LLM usage table (one row per call)';

-- ============================================================
-- User LLM integral table
-- One row = one user's integral (points) record.
-- The row is created on the user's first top-up and is only
-- updated afterwards; no new rows are inserted for later top-ups.
-- `user_id` is unique so there is exactly one row per user.
-- ============================================================
CREATE TABLE
    IF NOT EXISTS `t_user_llm_integral` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
        `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'User id',
        `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Tenant id, 0 = personal / no tenant',
        `integral` BIGINT NOT NULL DEFAULT 0 COMMENT 'Current integral (points) balance',
        `total_recharge` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Cumulative points ever recharged',
        `total_consume` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Cumulative points ever consumed',
        `first_recharge_time` DATETIME DEFAULT NULL COMMENT 'First top-up time',
        `last_recharge_time` DATETIME DEFAULT NULL COMMENT 'Last top-up time',
        `status` TINYINT NOT NULL DEFAULT 1 COMMENT 'Status: 0-disabled 1-enabled',
        `is_deleted` TINYINT NOT NULL DEFAULT 0 COMMENT 'Soft delete: 0-no 1-yes',
        `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create time',
        `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update time',
        PRIMARY KEY (`id`),
        UNIQUE KEY `uk_user_id` (`user_id`),
        KEY `idx_tenant_id` (`tenant_id`),
        KEY `idx_status` (`status`),
        KEY `idx_is_deleted` (`is_deleted`),
        KEY `idx_update_time` (`update_time`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'User LLM integral table (one row per user)';

-- ============================================================
-- User member table
-- One row = one user's membership record.
-- Only the membership expiry time is tracked, stored as a UNIX
-- timestamp (seconds). `expire_at` = 0 means no active membership.
-- ============================================================
CREATE TABLE
    IF NOT EXISTS `t_user_member` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
        `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'User id',
        `tenant_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Tenant id, 0 = personal / no tenant',
        `expire_at` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Membership expiry time (UNIX seconds), 0 = none',
        `status` TINYINT NOT NULL DEFAULT 1 COMMENT 'Status: 0-disabled 1-enabled',
        `is_deleted` TINYINT NOT NULL DEFAULT 0 COMMENT 'Soft delete: 0-no 1-yes',
        `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create time',
        `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update time',
        PRIMARY KEY (`id`),
        UNIQUE KEY `uk_user_id` (`user_id`),
        KEY `idx_tenant_id` (`tenant_id`),
        KEY `idx_expire_at` (`expire_at`),
        KEY `idx_status` (`status`),
        KEY `idx_is_deleted` (`is_deleted`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'User member table';

-- ============================================================
-- Initialization data
-- ============================================================
-- ------------------------------------------------------------
-- Default tenant
-- ------------------------------------------------------------
INSERT INTO
    `t_tenant_info` (
        `id`,
        `name`,
        `code`,
        `contact`,
        `phone`,
        `status`,
        `plan_id`,
        `expire_time`,
        `is_deleted`
    )
VALUES
    (
        1,
        'Default Tenant',
        'default',
        'admin',
        '13800000000',
        1,
        0,
        NULL,
        0
    ) ON DUPLICATE KEY
UPDATE `name` =
VALUES
    (`name`);

-- ------------------------------------------------------------
-- System built-in roles (tenant_id = 0)
-- SUPER_ADMIN : platform super administrator
-- TENANT_ADMIN: tenant administrator
-- TENANT_USER : normal tenant member
-- ------------------------------------------------------------
INSERT INTO
    `t_user_role_info` (
        `id`,
        `tenant_id`,
        `name`,
        `code`,
        `description`,
        `is_system`,
        `status`
    )
VALUES
    (
        1,
        0,
        'Super Admin',
        'SUPER_ADMIN',
        'Platform super administrator',
        1,
        1
    ),
    (
        2,
        0,
        'Tenant Admin',
        'TENANT_ADMIN',
        'Tenant administrator',
        1,
        1
    ),
    (
        3,
        0,
        'Tenant User',
        'TENANT_USER',
        'Normal tenant member',
        1,
        1
    ) ON DUPLICATE KEY
UPDATE `name` =
VALUES
    (`name`);