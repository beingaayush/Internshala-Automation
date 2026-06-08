# Internshala Automation – MERN Stack Automation Project

An end-to-end **MERN Stack automation project** that automates the Internshala internship application process 
using **Puppeteer**, with secure authentication, resume management, and a centralized dashboard.

## 🎥 Project Demo

Detailed walkthrough covering:
- Full project execution
- Architecture
- Folder structure
- Backend APIs
- Puppeteer automation flow
- JWT authentication

Watch Demo: https://www.loom.com/share/cac078918b9545c2812ff9d6da954bb1
-------------------------------------------

📌 Features

🔐 Authentication

* User Register & Login (JWT based)
* Protected routes
* Token-based authorization

📄 Resume Management

* Create / Update Resume
* Add multiple education entries
* Resume Preview / Fetch
* Delete Resume

📊 Dashboard

* User info
* Resume actions
* Automation controls
* Application status overview

🤖 Automation (Backend)

* Puppeteer-based automation
* Auto login to Internshala
* Auto apply using saved resume data
* Cookie handling for session reuse

---------------------------------------------

🛠 Tech Stack

**Frontend**

* React.js
* Axios
* CSS 

**Backend**

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* Puppeteer

-----------------------------------------------

📁 Folder Structure


INTERNSHALA AUTOMATION/
│
├── client/        # React frontend
├── Server/        # Node + Express backend
├── package.json   # Root scripts (concurrently)
└── README.md
```

------------------------------------------------


▶️ How to Run the Project :

1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd INTERNSHALA-AUTOMATION
```

2️⃣ Install dependencies

```bash
npm install
cd client && npm install
cd ../Server && npm install
```

3️⃣ Setup Environment Variables

Create `.env` inside `Server/`:

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
```

---

4️⃣ Run both frontend & backend together

```bash
npm run dev
```

✔️ Client → [http://localhost:3000](http://localhost:3000)
✔️ Server → [http://localhost:5000](http://localhost:5000)

--------------------------------------------

# ⚠️ Disclaimer

This project is built **for educational purposes only**.
Automating third-party platforms may violate their terms of service. Use responsibly.

--------------------------------------------

# 👨‍💻 Author

**Aayush Kumar**

--------------------------------------------

⭐ If you like this project, give it a star!
