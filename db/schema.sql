-- SalesGarners website database (MySQL 8+)
CREATE TABLE IF NOT EXISTS leads (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  type          ENUM('CONTACT','PILOT','WHITEPAPER') NOT NULL,
  status        ENUM('NEW','CONTACTED','QUALIFIED','CLOSED') NOT NULL DEFAULT 'NEW',
  first_name    VARCHAR(120) NOT NULL,
  last_name     VARCHAR(120) NULL,
  email         VARCHAR(191) NOT NULL,
  phone         VARCHAR(40)  NULL,
  company       VARCHAR(191) NULL,
  job_title     VARCHAR(191) NULL,
  message       TEXT NULL,
  resource      VARCHAR(191) NULL,
  source_page   VARCHAR(191) NULL,
  ip_address    VARCHAR(64)  NULL,
  user_agent    VARCHAR(255) NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_leads_type (type),
  INDEX idx_leads_email (email),
  INDEX idx_leads_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_posts (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(191) NOT NULL UNIQUE,
  title         VARCHAR(255) NOT NULL,
  excerpt       TEXT NULL,
  content       LONGTEXT NULL,
  cover_image   VARCHAR(255) NULL,
  published     TINYINT(1) NOT NULL DEFAULT 1,
  published_at  DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_blog_pub (published, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS case_studies (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(191) NOT NULL UNIQUE,
  title         VARCHAR(255) NOT NULL,
  summary       TEXT NULL,
  content       LONGTEXT NULL,
  cover_image   VARCHAR(255) NULL,
  external_url  VARCHAR(255) NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  published     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS jobs (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(191) NOT NULL UNIQUE,
  title         VARCHAR(255) NOT NULL,
  department    VARCHAR(120) NULL,
  location      VARCHAR(160) NULL,
  job_type      ENUM('FULL_TIME','PART_TIME','INTERNSHIP','CONTRACT') NOT NULL DEFAULT 'FULL_TIME',
  work_mode     ENUM('OFFICE','HYBRID','REMOTE') NOT NULL DEFAULT 'OFFICE',
  experience    VARCHAR(80) NULL,
  salary        VARCHAR(120) NULL,
  summary       TEXT NULL,
  description   LONGTEXT NULL,
  status        ENUM('OPEN','CLOSED') NOT NULL DEFAULT 'OPEN',
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_jobs_status (status, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS job_applications (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  job_id          INT NULL,               -- NULL = general application
  status          ENUM('NEW','SHORTLISTED','INTERVIEW','REJECTED','HIRED') NOT NULL DEFAULT 'NEW',
  full_name       VARCHAR(191) NOT NULL,
  email           VARCHAR(191) NOT NULL,
  phone           VARCHAR(40)  NULL,
  linkedin        VARCHAR(255) NULL,
  cover_note      TEXT NULL,
  resume_file     VARCHAR(255) NULL,      -- stored name inside storage/resumes
  resume_original VARCHAR(255) NULL,      -- original file name
  ip_address      VARCHAR(64)  NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_app_job (job_id),
  INDEX idx_app_created (created_at),
  CONSTRAINT fk_app_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS whitepapers (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(191) NOT NULL UNIQUE,
  title         VARCHAR(255) NOT NULL,
  description   TEXT NULL,
  cover_image   VARCHAR(255) NULL,        -- public URL, e.g. /uploads/whitepapers/x.webp
  pdf_file      VARCHAR(255) NULL,        -- stored name inside storage/whitepapers
  pdf_original  VARCHAR(255) NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  published     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
