require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");  
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const OrdersModel = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const { SessionModel } = require("./model/SessionModel");
const port = process.env.PORT || 3001;
const uri = process.env.MONGO_URL;
const sessionCookieName = "zerodha_session";
const sessionDurationMs = 7 * 24 * 60 * 60 * 1000;
const scrypt = promisify(crypto.scrypt);

const app = express();
const apiRouter = express.Router();

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  process.env.DASHBOARD_URL || "http://localhost:3001",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));

const getCookieValue = (req, cookieName) => {
  const cookies = (req.headers.cookie || "").split(";");
  const cookie = cookies.find((item) => item.trim().startsWith(`${cookieName}=`));
  return cookie ? cookie.trim().slice(cookieName.length + 1) : "";
};

const setSessionCookie = (res, token) => {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${sessionCookieName}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionDurationMs / 1000}${secure}`
  );
};

const clearSessionCookie = (res) => {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${sessionCookieName}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`
  );
};

const createSession = async (user, res) => {
  const token = crypto.randomBytes(32).toString("hex");
  await SessionModel.create({
    userId: user._id,
    tokenHash: crypto.createHash("sha256").update(token).digest("hex"),
    expiresAt: new Date(Date.now() + sessionDurationMs),
  });
  setSessionCookie(res, token);
};

const requireAuth = async (req, res, next) => {
  const token = getCookieValue(req, sessionCookieName);
  if (!token) {
    res.status(401).json({ message: "Please sign in to continue" });
    return;
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const session = await SessionModel.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  }).populate("userId", "name email cashBalance");

  if (!session || !session.userId) {
    clearSessionCookie(res);
    res.status(401).json({ message: "Your session has expired. Please sign in again" });
    return;
  }

  if (typeof session.userId.cashBalance !== "number") {
    await UserModel.updateOne(
      { _id: session.userId._id, cashBalance: { $exists: false } },
      { $set: { cashBalance: 10000 } }
    );
    session.userId.cashBalance = 10000;
  }

  req.user = session.userId;
  req.sessionId = session._id;
  next();
};

const hashPassword = async (password, salt = crypto.randomBytes(16).toString("hex")) => {
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
};

const isValidPassword = async (password, storedHash) => {
  const [salt, storedKey] = storedHash.split(":");
  if (!salt || !storedKey) {
    return false;
  }
  const expectedKey = Buffer.from(storedKey, "hex");
  const actualKey = await scrypt(password, salt, expectedKey.length);
  return expectedKey.length === actualKey.length &&
    crypto.timingSafeEqual(expectedKey, actualKey);
};

apiRouter.post("/auth/register", async (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body.email === "string"
    ? req.body.email.trim().toLowerCase()
    : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (
    !name ||
    name.length > 80 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    password.length < 8 ||
    password.length > 128
  ) {
    res.status(400).json({
      message: "Enter a valid name and email, and a password between 8 and 128 characters",
    });
    return;
  }

  try {
    const user = await UserModel.create({
      name,
      email,
      passwordHash: await hashPassword(password),
    });
    await createSession(user, res);
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ message: "An account with this email already exists" });
      return;
    }
    console.error("Failed to register user:", error);
    res.status(500).json({ message: "Unable to create account right now" });
  }
});

apiRouter.post("/auth/login", async (req, res) => {
  const email = typeof req.body.email === "string"
    ? req.body.email.trim().toLowerCase()
    : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const user = await UserModel.findOne({ email }).select("+passwordHash");
    if (!user || !(await isValidPassword(password, user.passwordHash))) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    await createSession(user, res);
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Failed to sign in:", error);
    res.status(500).json({ message: "Unable to sign in right now" });
  }
});

apiRouter.get("/auth/me", requireAuth, (req, res) => {
  res.json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
});

apiRouter.post("/auth/logout", requireAuth, async (req, res) => {
  await SessionModel.deleteOne({ _id: req.sessionId });
  clearSessionCookie(res);
  res.status(204).end();
});

apiRouter.get("/health", (req, res) => {
  const isDatabaseConnected = mongoose.connection.readyState === 1;
  res.status(isDatabaseConnected ? 200 : 503).json({
    status: isDatabaseConnected ? "ok" : "unavailable",
    database: isDatabaseConnected ? "connected" : "disconnected",
  });
});

// app.get("/addHoldings", async (req, res) => {
//   let tempholdings = [
//     {
//       name: "BHARTIARTL",
//       qty: 2,
//       avg: 538.05,
//       price: 541.15,
//       net: "+0.58%",
//       day: "+2.99%",
//     },
//     {
//       name: "HDFCBANK",
//       qty: 2,
//       avg: 1383.4,
//       price: 1522.35,
//       net: "+10.04%",
//       day: "+0.11%",
//     },
//     {
//       name: "HINDUNILVR",
//       qty: 1,
//       avg: 2335.85,
//       price: 2417.4,
//       net: "+3.49%",
//       day: "+0.21%",
//     },
//     {
//       name: "INFY",
//       qty: 1,
//       avg: 1350.5,
//       price: 1555.45,
//       net: "+15.18%",
//       day: "-1.60%",
//       isLoss: true,
//     },
//     {
//       name: "ITC",
//       qty: 5,
//       avg: 202.0,
//       price: 207.9,
//       net: "+2.92%",
//       day: "+0.80%",
//     },
//     {
//       name: "KPITTECH",
//       qty: 5,
//       avg: 250.3,
//       price: 266.45,
//       net: "+6.45%",
//       day: "+3.54%",
//     },
//     {
//       name: "M&M",
//       qty: 2,
//       avg: 809.9,
//       price: 779.8,
//       net: "-3.72%",
//       day: "-0.01%",
//       isLoss: true,
//     },
//     {
//       name: "RELIANCE",
//       qty: 1,
//       avg: 2193.7,
//       price: 2112.4,
//       net: "-3.71%",
//       day: "+1.44%",
//     },
//     {
//       name: "SBIN",
//       qty: 4,
//       avg: 324.35,
//       price: 430.2,
//       net: "+32.63%",
//       day: "-0.34%",
//       isLoss: true,
//     },
//     {
//       name: "SGBMAY29",
//       qty: 2,
//       avg: 4727.0,
//       price: 4719.0,
//       net: "-0.17%",
//       day: "+0.15%",
//     },
//     {
//       name: "TATAPOWER",
//       qty: 5,
//       avg: 104.2,
//       price: 124.15,
//       net: "+19.15%",
//       day: "-0.24%",
//       isLoss: true,
//     },
//     {
//       name: "TCS",
//       qty: 1,
//       avg: 3041.7,
//       price: 3194.8,
//       net: "+5.03%",
//       day: "-0.25%",
//       isLoss: true,
//     },
//     {
//       name: "WIPRO",
//       qty: 4,
//       avg: 489.3,
//       price: 577.75,
//       net: "+18.08%",
//       day: "+0.32%",
//     },
//   ];

//   tempholdings.forEach((item) => {
//     let newHoldings = new HoldingsModel({
//         name: item.qty,
//         qty: item.qty,
//         avg: item.avg,
//         price: item.price,
//         net: item.day,
//         day: item.day,
//     })
//     newHoldings.save();
//   });
//   res.send("Done!");
// });

// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       qty: 2,
//       avg: 316.27,
//       price: 312.35,
//       net: "+0.58%",
//       day: "-1.24%",
//       isLoss: true,
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       qty: 1,
//       avg: 3124.75,
//       price: 3082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//       isLoss: true,
//     },
//   ];
//   tempPositions.forEach((item) => {
//     let newPosition = new PositionModel({
//         product: item.product,
//         name: item.name,
//         qty: item.qty,
//         avg: item.avg,
//         price: item.price,
//         net: item.net,
//         day: item.day,
//         isLoss: item.isLoss,
//     });
//     newPosition.save();
//   });
//   res.send("Done");
// });

apiRouter.get("/allHoldings", requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("holdings");
    const allHoldings = user?.holdings || [];
    res.json(allHoldings);
  } catch (error) {
    console.error("Failed to fetch holdings:", error);
    res.status(500).json({ message: "Failed to fetch holdings" });
  }
});

apiRouter.get("/allPositions", requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("positions");
    const allPositions = user?.positions || [];
    res.json(allPositions);
  } catch (error) {
    console.error("Failed to fetch positions:", error);
    res.status(500).json({ message: "Failed to fetch positions" });
  }
});

apiRouter.get("/allOrders", requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("orders");
    const savedOrders = (user?.orders || []).map((order) => order.toObject());
    const legacyOrders = await OrdersModel.find({ userId: req.user._id }).lean();
    const allOrders = [...savedOrders, ...legacyOrders].sort(
      (left, right) =>
        new Date(right.createdAt || right._id.getTimestamp()).getTime() -
        new Date(left.createdAt || left._id.getTimestamp()).getTime()
    );
    res.json(allOrders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

apiRouter.get("/funds", requireAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select(
      "cashBalance fundsTransactions"
    );
    if (!user) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    res.json({
      cashBalance: user.cashBalance,
      openingBalance: 10000,
      fundsTransactions: user.fundsTransactions.slice().reverse(),
    });
  } catch (error) {
    console.error("Failed to fetch funds:", error);
    res.status(500).json({ message: "Failed to fetch funds" });
  }
});

apiRouter.post("/funds/deposit", requireAuth, async (req, res) => {
  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) {
    res.status(400).json({ message: "Enter a deposit amount between ₹0.01 and ₹1,00,00,000" });
    return;
  }

  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    user.cashBalance += amount;
    user.fundsTransactions.push({ type: "PAYIN", amount });
    await user.save();
    res.status(201).json({ cashBalance: user.cashBalance });
  } catch (error) {
    console.error("Failed to add demo funds:", error);
    res.status(500).json({ message: "Unable to add demo funds" });
  }
});

apiRouter.post("/funds/withdraw", requireAuth, async (req, res) => {
  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) {
    res.status(400).json({ message: "Enter a withdrawal amount between ₹0.01 and ₹1,00,00,000" });
    return;
  }

  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "Account not found" });
      return;
    }
    if (amount > user.cashBalance) {
      res.status(400).json({ message: "Withdrawal amount exceeds available demo funds" });
      return;
    }

    user.cashBalance -= amount;
    user.fundsTransactions.push({ type: "WITHDRAWAL", amount });
    await user.save();
    res.status(201).json({ cashBalance: user.cashBalance });
  } catch (error) {
    console.error("Failed to withdraw demo funds:", error);
    res.status(500).json({ message: "Unable to withdraw demo funds" });
  }
});

apiRouter.post("/newOrder", requireAuth, async (req, res) => {
  const { name, qty, price, mode, product = "CNC" } = req.body;
  const orderName = typeof name === "string" ? name.trim() : "";
  const quantity = Number(qty);
  const orderPrice = Number(price);
  const orderMode = typeof mode === "string" ? mode.toUpperCase() : "";
  const orderProduct = typeof product === "string" ? product.toUpperCase() : "";

  if (
    !orderName ||
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    !Number.isFinite(orderPrice) ||
    orderPrice <= 0 ||
    !["BUY", "SELL"].includes(orderMode) ||
    !["CNC", "MIS"].includes(orderProduct)
  ) {
    return res.status(400).json({
      message: "A valid instrument, positive whole-number quantity and price, BUY or SELL mode, and CNC or MIS product are required",
    });
  }

  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    const portfolio = orderProduct === "CNC" ? user.holdings : user.positions;
    const instrument = portfolio.find(
      (item) => item.name.toUpperCase() === orderName.toUpperCase()
    );
    const orderValue = quantity * orderPrice;

    if (orderMode === "BUY" && orderValue > user.cashBalance) {
      res.status(400).json({ message: "Insufficient demo funds for this order" });
      return;
    }
    if (orderMode === "SELL" && (!instrument || quantity > instrument.qty)) {
      res.status(400).json({
        message: "You cannot sell more shares than you hold in this product",
      });
      return;
    }

    if (orderMode === "BUY") {
      user.cashBalance -= orderValue;
      if (instrument) {
        instrument.avg =
          (instrument.avg * instrument.qty + orderValue) /
          (instrument.qty + quantity);
        instrument.qty += quantity;
        instrument.price = orderPrice;
      } else {
        const newInstrument = {
          name: orderName,
          qty: quantity,
          avg: orderPrice,
          price: orderPrice,
          net: "0.00%",
          day: "0.00%",
        };
        if (orderProduct === "MIS") newInstrument.product = "MIS";
        portfolio.push(newInstrument);
      }
    } else {
      user.cashBalance += orderValue;
      instrument.qty -= quantity;
      instrument.price = orderPrice;
      if (instrument.qty === 0) portfolio.splice(portfolio.indexOf(instrument), 1);
    }

    const savedOrder = {
      name: orderName,
      qty: quantity,
      price: orderPrice,
      mode: orderMode,
      product: orderProduct,
      createdAt: new Date(),
    };
    user.orders.push(savedOrder);
    await user.save();

    const newOrder = user.orders[user.orders.length - 1];
    res.status(201).json(newOrder);
  } catch (error) {
    if (error.name === "VersionError") {
      res.status(409).json({
        message: "Account changed during this request. Refresh your balance and try again.",
      });
      return;
    }
    console.error("Failed to save order:", error);
    res.status(500).json({ message: "Failed to save order" });
  }
});

app.use("/api", apiRouter);
app.use("/", apiRouter);
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

const frontendBuildPath = path.join(__dirname, "..", "frontend", "build");
const dashboardBuildPath = path.join(__dirname, "..", "dashboard", "build");

if (fs.existsSync(dashboardBuildPath)) {
  app.use("/dashboard", express.static(dashboardBuildPath));
  app.use("/dashboard", (req, res, next) => {
    if (req.method !== "GET") {
      next();
      return;
    }
    res.sendFile(path.join(dashboardBuildPath, "index.html"));
  });
}

if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/")) {
      next();
      return;
    }
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

const startServer = async () => {
  try {
    await mongoose.connect(uri);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
      console.log("Database connected");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exitCode = 1;
  }
};

startServer();
