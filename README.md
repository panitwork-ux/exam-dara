# 📝 ExamDara — ระบบตรวจข้อสอบ
### โรงเรียนดาราวิทยาลัย

PWA ระบบตรวจข้อสอบด้วยกล้องมือถือ สไตล์ iOS ธีมขาว-แดง

---

## 🚀 วิธีรันในเครื่อง (Development)

\`\`\`bash
# 1. ติดตั้ง dependencies
npm install

# 2. รัน dev server
npm run dev

# 3. เปิดเบราว์เซอร์ที่ http://localhost:5173
\`\`\`

---

## 🏗️ Build สำหรับ Production

\`\`\`bash
npm run build
# ไฟล์พร้อม deploy อยู่ในโฟลเดอร์ dist/
\`\`\`

---

## ☁️ Deploy ขึ้น GitHub Pages

\`\`\`bash
# ครั้งแรก — ตั้งค่า remote
git remote add origin https://github.com/YOUR_USERNAME/exam-dara.git

# Push code ขึ้น
git add .
git commit -m "deploy: ExamDara v1.0"
git push origin main

# เปิด GitHub Pages:
# Settings → Pages → Deploy from branch → main → /dist
\`\`\`

---

## 🔑 Admin Panel
- กด "Admin Panel" ที่หน้า Login หรือในหน้า Profile
- รหัส: **100625**
- ตั้งค่าได้: ชื่อโรงเรียน + URL โลโก้

---

## ✅ Features

| Feature | รายละเอียด |
|---|---|
| 📷 OMR Scan | ถ่ายกระดาษคำตอบ ผลออกใน 3 วิ |
| ⚠️ Plan B Queue | QR อ่านไม่ได้ → เลือกชื่อด้วยมือ |
| 🎨 ออกแบบกระดาษ | กำหนดข้อ / ตัวเลือก / เฉลย |
| 👥 รายชื่อนักเรียน | Import Excel/CSV |
| 📊 รายงาน | Item Analysis + Distribution |
| ☁️ Google Drive | บันทึกข้อมูลใน Drive ครูแต่ละคน |
| 📱 PWA | ติดตั้งบนมือถือเหมือนแอพ |

---

## 📂 โครงสร้างโปรเจกต์

\`\`\`
exam-dara/
├── src/
│   ├── App.jsx          ← React App หลัก (ทุก screens + components)
│   └── main.jsx         ← Entry point
├── assets/
│   ├── icon-192.png     ← PWA icon
│   └── icon-512.png     ← PWA icon (maskable)
├── index.html           ← HTML template
├── vite.config.js       ← Vite + PWA config
├── package.json         ← Dependencies
├── manifest.json        ← PWA manifest
└── .gitignore
\`\`\`

---

## 🆓 Stack ฟรีทั้งหมด
- **Framework:** React 18 + Vite
- **PWA:** vite-plugin-pwa
- **Hosting:** GitHub Pages / Vercel (ฟรี)
- **Storage:** Google Drive API (20 GB จากโรงเรียน)
- **Auth:** Google OAuth (ฟรี)
