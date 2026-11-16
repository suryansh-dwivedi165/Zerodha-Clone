# 📈 Zerodha Clone

A full-stack stock trading platform inspired by Zerodha, built using **React.js, Node.js, Express.js, MongoDB, and Bootstrap**. The application provides a modern trading dashboard where users can manage their portfolio, holdings, and watchlist through a responsive and user-friendly interface.

---

## ✨ Features

- 🔐 User Authentication (Sign Up, Login & Logout)
- 📊 Interactive Trading Dashboard
- 📈 Portfolio & Holdings Management
- 📋 Watchlist Management
- 💹 Buy & Sell Order Interface
- 🔒 Protected Routes
- ⚡ RESTful API Integration
- 📱 Fully Responsive Design

---

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript (ES6+)
- Bootstrap 5
- HTML5
- CSS3
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JWT
- Bcrypt.js
- Express Session
- CORS

### Other Tools
- Dotenv
- REST API

---

## 📂 Project Structure

```text
zerodha-clone/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── index.js
│   ├── package.json
│
├── README.md
└── .gitignore
```

---

## 🚀 Run locally

Install dependencies from the repository root:

```powershell
cd frontend
npm install
cd ..\dashboard
npm install
cd ..\backend
npm install
```

Set `MONGO_URL` in `backend\.env` to your MongoDB connection string. Then, from
the `backend` folder, run:

```powershell
npm run start:site
```

This builds the website and dashboard and serves them, together with the API,
from one origin:

- Website: `http://localhost:3001/`
- Dashboard: `http://localhost:3001/dashboard`
- API health: `http://localhost:3001/api/health`

Stop any existing dashboard or backend dev servers before starting the unified
server, since it uses port `3001`.

## Deploy as one Vercel application

Import the repository root (`delta-demo`) as a single Vercel project. The
`vercel.json` build combines the frontend and dashboard into one static output,
serves the Express API under `/api/*`, and keeps dashboard routes under
`/dashboard/*`. Configure `MONGO_URL` in the Vercel project's Environment
Variables, then deploy. The frontend and dashboard use same-origin API and
navigation paths in production, so separate frontend/backend URLs are not
required.

---

## 📸 Screenshots

### Home Page

_Add Home Page Screenshot_

### Dashboard

_Add Dashboard Screenshot_

### Portfolio

_Add Portfolio Screenshot_

### Holdings

_Add Holdings Screenshot_

### Watchlist

_Add Watchlist Screenshot_

---

## 🌐 Live Demo

Coming Soon...

---

## 🚀 Future Enhancements

- 📈 Live Stock Market Data
- 📊 Interactive Charts
- 🔔 Price Alerts
- 🌙 Dark Mode
- 📱 Mobile Optimization
- 📄 Transaction History
- 💳 Payment Gateway Integration

---

## 🤝 Contributing

Contributions are welcome.

Feel free to fork this repository and submit a pull request.

---

## 👨‍💻 Author

**Suryansh Dwivedi**

- GitHub: https://github.com/suryansh-dwivedi165

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---

## 📄 License

This project is developed for educational and learning purposes. 