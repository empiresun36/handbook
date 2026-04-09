# 社區管理規劃手冊 — 檔案說明與維護指南

## 📁 檔案結構

```
handbook/
├── index.html          ← 首頁（公告、目錄、角色快捷）
├── ch01-rules.html     ← 第一篇：社區規約
├── ch02-committee.html ← 第二篇：管委會運作手冊
├── ch03-residents.html ← 第三篇：住戶生活公約
├── ch04-property.html  ← 第四篇：物業管理準則
├── ch05-cleaning.html  ← 第五篇：清潔管理準則
├── contact.html        ← 緊急聯絡資訊
├── shared.css          ← 共用樣式（修改此檔影響所有頁面外觀）
├── shared.js           ← 共用互動邏輯（選單、折疊、Tab切換）
└── README.md           ← 本說明文件
```

---

## ✏️ 常見維護操作

### 1. 修改公告（首頁）
開啟 `index.html`，找到「最新公告」區塊：

```html
<!-- ★ 維護提示：新增公告只需複製下方 notice 區塊並修改文字 -->
<div class="notice info">...</div>   ← 藍色提示框
<div class="notice warn">...</div>   ← 黃色警示框
<div class="notice success">...</div> ← 綠色成功框
<div class="notice danger">...</div> ← 紅色警告框
```

### 2. 修改管理費金額
開啟 `ch01-rules.html`，搜尋「第 9 條」，修改表格中的金額數字。

### 3. 修改電話號碼
開啟 `contact.html`，搜尋 `href="tel:`，替換為實際電話號碼。
```html
<a href="tel:+886-912-000-001" class="contact-btn">📞</a>
```

### 4. 修改作業時間
在各 ch0X 檔案中，找到 `<div class="schedule-task">` 修改時間與內容。

### 5. 修改罰款金額
開啟 `ch01-rules.html`，搜尋「penalty-item」，修改金額與說明。

### 6. 修改管理費計收標準
開啟 `ch01-rules.html`，搜尋「第 9 條」的 `<table>` 修改各欄位。

---

## 🎨 外觀調整

開啟 `shared.css`，修改頂部的 CSS 變數：

```css
:root {
  --primary: #1a3a2a;      ← 主色（深綠色）
  --accent: #c8a96e;       ← 強調色（金色）
}
```

---

## 📤 上架到網站

將以下所有檔案上傳至網頁伺服器的**同一個資料夾**：
- 所有 `.html` 檔案
- `shared.css`
- `shared.js`

開啟網址時以 `index.html` 為首頁，例如：
```
https://your-domain.com/handbook/index.html
```

---

## 📋 底部導覽列說明（6個分頁）

| 圖示 | 名稱 | 連結檔案 |
|------|------|---------|
| 🏠 | 首頁 | index.html |
| 📜 | 規約 | ch01-rules.html |
| 👥 | 住戶 | ch03-residents.html |
| 🔒 | 物業 | ch04-property.html |
| 🧹 | 清潔 | ch05-cleaning.html |
| 📞 | 聯絡 | contact.html |

> 第二篇（管委會）可由首頁目錄或左側選單進入。

---

最後更新：2025年1月
