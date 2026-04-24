# 🚀 คู่มืออัพโหลดขึ้น GitHub

## ถ้ามี Git repo อยู่แล้ว (ใช้ repo เดิม)

### วิธีที่ 1 — เพิ่ม folder exam-dara เข้า repo เดิม

```bash
# 1. ไปที่ root ของ repo เดิมของคุณ
cd /path/to/your-existing-repo

# 2. สร้างโฟลเดอร์ exam-dara แล้วคัดลอกไฟล์เข้าไป
mkdir exam-dara
cp -r /path/to/exam-dara/* exam-dara/

# 3. Add และ commit
git add exam-dara/
git commit -m "feat: add exam-dara ExamScan app"
git push
```

---

### วิธีที่ 2 — สร้าง branch ใหม่ใน repo เดิม

```bash
# ไปที่ repo เดิม
cd /path/to/your-existing-repo

# สร้าง branch ใหม่
git checkout -b exam-dara

# คัดลอกไฟล์ทั้งหมดเข้า root
cp -r /path/to/exam-dara/* .

# Add และ commit
git add .
git commit -m "feat: ExamScan Daravit — ระบบตรวจข้อสอบ"
git push origin exam-dara
```

GitHub Pages จะ deploy branch นี้ได้ที่:
Settings → Pages → Branch: exam-dara

---

## ถ้าต้องการสร้าง repo ใหม่

```bash
# 1. ไปที่โฟลเดอร์ exam-dara
cd /path/to/exam-dara

# 2. เริ่มต้น git
git init

# 3. ตั้งค่า (ทำครั้งเดียว)
git config --global user.name "ชื่อของคุณ"
git config --global user.email "email@daravit.ac.th"

# 4. Add ทุกไฟล์
git add .

# 5. Commit แรก
git commit -m "🎉 init: ExamScan Daravit v1.0"

# 6. สร้าง repo ที่ github.com แล้วใส่ URL ด้านล่าง
git remote add origin https://github.com/YOUR_USERNAME/exam-dara.git

# 7. Push
git branch -M main
git push -u origin main
```

---

## เปิด GitHub Pages

1. ไปที่ repo บน GitHub
2. **Settings** → **Pages**
3. Source: **Deploy from branch**
4. Branch: **main** / root
5. กด **Save**
6. รอ 2-3 นาที → URL: `https://YOUR_USERNAME.github.io/exam-dara`

---

## อัพเดทไฟล์ในอนาคต

```bash
git add .
git commit -m "update: สิ่งที่แก้ไข"
git push
```

---

## ติดตั้งบนมือถือ (PWA)

**iPhone Safari:**
Share → Add to Home Screen → Add

**Android Chrome:**
⋮ เมนู → Add to Home screen → Add
