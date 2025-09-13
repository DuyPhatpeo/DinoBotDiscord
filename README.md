# 🤖 DinoBot Discord

DinoBot là một Discord Bot đa năng được viết bằng **Node.js** nhằm hỗ trợ quản lý server và mang lại trải nghiệm thú vị cho người dùng.  
Bot có thể được tùy biến linh hoạt và dễ dàng deploy trên nhiều nền tảng.

---

## 🚀 Tính năng chính

- Quản lý server (kick, ban, mute, v.v.)
- Cấu hình dễ dàng mở rộng

---

## 📦 Cài đặt cục bộ

### 1. Clone repo

```bash
git clone https://github.com/DuyPhatpeo/DinoBotDiscord.git
```

```bash
cd DinoBotDiscord
```

### 2. Cài dependencies

```bash
npm install
```

### 3. Tạo file .env

Trong thư mục gốc, tạo file .env và thêm:

```bash
TOKEN=your_discord_bot_token
PREFIX=!
```

### 4. Chạy bot

```bash
npm start
```

🌐 Triển khai (Deploy)
🔹 Render
Vào [Render Dashboard](https://dashboard.render.com/)

Kết nối repo GitHub

Thêm biến môi trường trong phần Environment (TOKEN, PREFIX, v.v.)

Deploy và bot sẽ chạy tự động 24/7

🔹 UptimeRobot
Tạo project ở [UptimeRobot](https://dashboard.uptimerobot.com/)

Thêm monitor HTTP(s) trỏ tới URL bot (Render cung cấp link dạng **https://<tên-app>.onrender.com/**)

UptimeRobot sẽ ping bot định kỳ để giữ bot online liên tục

🛠 Công nghệ sử dụng
[Node.js](https://nodejs.org/)

[Discord.js](https://discord.js.org/)

[Render](https://render.com/) để deploy

[UptimeRobot](https://uptimerobot.com/) để giữ bot online
