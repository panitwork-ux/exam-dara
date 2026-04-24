# 🚀 คำสั่ง Git — exam-dara

## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ถ้ายังไม่มี Repo บน GitHub
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### ขั้นตอนที่ 1 — สร้าง Repo ใหม่บน GitHub
1. ไปที่ https://github.com/new
2. Repository name: **exam-dara**
3. เลือก **Public**
4. ❌ อย่าติ๊ก "Add README" (เรามี README อยู่แล้ว)
5. กด **Create repository**


## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ถ้าต้องการใช้ Repo เดิมที่มีอยู่
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

แทนที่จะสร้าง repo ใหม่ ให้ push เข้า repo เดิมได้เลย
เพียงแค่ใช้ URL ของ repo เดิมในคำสั่ง `git remote add origin`


## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## คำสั่ง Git (ทำในโฟลเดอร์ exam-dara)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

\`\`\`bash
# เปิด Terminal แล้วไปที่โฟลเดอร์โปรเจกต์
cd exam-dara

# ── ครั้งแรก (Init) ─────────────────────────────
git init
git add .
git commit -m "🎉 first commit: ExamDara v1.0 — ระบบตรวจข้อสอบดาราวิทยาลัย"

# ── เชื่อม GitHub (เปลี่ยน YOUR_USERNAME) ────────
git remote add origin https://github.com/YOUR_USERNAME/exam-dara.git
git branch -M main
git push -u origin main


# ── อัพเดทครั้งต่อไป ────────────────────────────
git add .
git commit -m "update: อธิบายสิ่งที่แก้ไข"
git push
\`\`\`


## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## Deploy GitHub Pages (ฟรี!)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### วิธีที่ 1 — GitHub Pages จาก /dist

\`\`\`bash
# Build โปรเจกต์ก่อน
npm install
npm run build

# Push โฟลเดอร์ dist ขึ้น branch gh-pages
git add dist -f
git commit -m "build: deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
\`\`\`

แล้วไปที่ Settings → Pages → เลือก branch **gh-pages**
URL จะเป็น: https://YOUR_USERNAME.github.io/exam-dara/

---

### วิธีที่ 2 — Vercel (แนะนำ ง่ายกว่า!)

1. ไปที่ https://vercel.com
2. กด **"Add New Project"**
3. เลือก repo **exam-dara** จาก GitHub
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. กด **Deploy** 🚀

ได้ URL ทันที: https://exam-dara.vercel.app


## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ติดตั้งบนมือถือ (PWA)
## ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### iPhone (Safari):
1. เปิด Safari → ไปที่ URL ของแอพ
2. กดปุ่ม Share (□↑)
3. เลือก "Add to Home Screen"
4. ตั้งชื่อ "ExamDara" → กด Add

### Android (Chrome):
1. เปิด Chrome → ไปที่ URL
2. กด ⋮ (เมนู 3 จุด)
3. เลือก "Add to Home screen"
4. กด Add

