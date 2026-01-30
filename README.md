
# Qalaah Advanced POS | القلعة نظام نقاط البيع المتقدم

نظام نقاط بيع (POS) و ERP متكامل، احترافي، وقابل للتوسع، متوافق مع متطلبات هيئة الزكاة والضريبة والجمارك السعودية (ZATCA)، مبني باستخدام Node.js/Express وPostgreSQL للواجهة الخلفية وHTML/CSS/JS للواجهة الأمامية.

A fully integrated, professional, and scalable point of sale (POS) and ERP system that complies with the requirements of the Saudi Zakat, Tax and Customs Authority (ZATCA), built using Node.js/Express and PostgreSQL for the back end and HTML/CSS/JS for the front end.

---

## Overview | نظرة عامة

**English:**
Qalaah is a professional, scalable POS & ERP system, fully compliant with Saudi ZATCA e-invoicing requirements. Built with Node.js/Express and PostgreSQL (backend), and HTML/CSS/JS (frontend).

**العربية:**
نظام القلعة هو نظام نقاط بيع وERP احترافي وقابل للتوسع، متوافق مع متطلبات الفوترة الإلكترونية السعودية (ZATCA)، مبني باستخدام Node.js/Express وPostgreSQL للواجهة الخلفية وHTML/CSS/JS للواجهة الأمامية.

---

## Features | الميزات الرئيسية

**English:**
- Branch, product, customer, sales, invoice, inventory, roles, and settings management
- Advanced RBAC permissions, data encryption, and security
- Full ZATCA Phase 2 e-invoicing (QR, XML, digital signature)
- Audit log for all sensitive operations
- Export to PDF/Excel
- Bilingual (Arabic/English) with ready translation files
- Database backup & restore (PowerShell script)

**العربية:**
- إدارة الفروع، المنتجات، العملاء، المبيعات، الفواتير، المخزون، الصلاحيات، والإعدادات
- نظام صلاحيات متقدم (RBAC) مع تشفير وحماية البيانات
- تكامل كامل مع متطلبات الفوترة الإلكترونية (ZATCA) المرحلة الثانية (QR, XML, توقيع رقمي)
- سجل تدقيق لجميع العمليات الحساسة
- دعم تصدير البيانات إلى PDF/Excel
- دعم لغتين (عربي/إنجليزي) مع ملفات ترجمة جاهزة
- نسخ احتياطي واستعادة لقاعدة البيانات (PowerShell script)

---

## Requirements | المتطلبات

**English:**
- Node.js 18+
- PostgreSQL 13+
- PowerShell (for backup)

**العربية:**
- Node.js 18 أو أحدث
- PostgreSQL 13 أو أحدث
- PowerShell (لعمليات النسخ الاحتياطي)

---

## Setup & Run | الإعداد والتشغيل

### 1. Database Setup | إعداد قاعدة البيانات

**English:**
- Create a new PostgreSQL database (e.g., qalaah_db)
- Update connection variables in `.env` inside backend folder:
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=your_user
  DB_PASSWORD=your_password
  DB_NAME=qalaah_db
  JWT_SECRET=your_strong_secret
  ```

**العربية:**
- أنشئ قاعدة بيانات PostgreSQL جديدة (مثلاً: qalaah_db)
- حدث متغيرات الاتصال في ملف `.env` داخل مجلد backend:
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=اسم_المستخدم
  DB_PASSWORD=كلمة_المرور
  DB_NAME=qalaah_db
  JWT_SECRET=سر_سري_قوي
  ```

### 2. Install Dependencies | تثبيت الحزم
```bash
cd backend
npm install
```

### 3. Run Backend Server | تشغيل السيرفر
```bash
npm start
```

### 4. Run Frontend | تشغيل الواجهة الأمامية

**English:**
- Open `frontend/index.html` directly in your browser.

**العربية:**
- افتح الملف `frontend/index.html` مباشرة في المتصفح.

### 5. Backup | النسخ الاحتياطي

**English:**
- Run `backend/scripts/backup_db.ps1` via PowerShell to backup the database.

**العربية:**
- شغّل السكربت `backend/scripts/backup_db.ps1` عبر PowerShell لعمل نسخة احتياطية من قاعدة البيانات.

---

## Structure | الهيكلية
```
Qalaah/
├── backend/
│   ├── src/
│   │   ├── api/           # REST APIs | جميع نقاط REST
│   │   ├── models/        # ORM Models | نماذج ORM
│   │   ├── services/      # Services (ZATCA, ...) | الخدمات
│   │   ├── utils/         # Utilities (crypto, ...) | أدوات مساعدة
│   │   └── app.js         # Server entry point | نقطة دخول السيرفر
│   ├── scripts/           # Backup scripts | سكربتات النسخ الاحتياطي
│   └── .env               # Environment config | إعدادات البيئة
├── frontend/
│   ├── assets/js/         # Main JS files | ملفات JS الرئيسية
│   ├── components/        # UI components | مكونات الواجهة
│   ├── i18n/              # Translation files | ملفات الترجمة
│   └── index.html         # Main page | الصفحة الرئيسية
└── README.md
```

---

## More Info | معلومات إضافية

**English:**
- All code is written in vanilla JS (no heavy frontend frameworks)
- System is customizable and can be extended to a full ERP
- All sensitive operations are logged (audit log)
- Fully compliant with Saudi e-invoicing (ZATCA)

**العربية:**
- جميع الأكواد مكتوبة بدون أطر عمل ثقيلة في الواجهة الأمامية (Vanilla JS)
- النظام قابل للتخصيص والتطوير ليصبح ERP متكامل
- جميع العمليات الحساسة مسجلة في سجل تدقيق
- متوافق مع متطلبات الفوترة الإلكترونية السعودية

---

## Support | الدعم

**English:**
For support or inquiries, contact the developer or open a support ticket.

**العربية:**
لأي استفسار أو دعم فني، يرجى التواصل مع المطور أو فتح تذكرة دعم.


