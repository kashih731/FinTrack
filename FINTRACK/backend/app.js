import express from "express";
import cors from "cors";
import { connectDB } from "./DB/Database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";
import path from "path";

const __dirname = path.resolve(); // To resolve paths in ES6 modules

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Set default port if not provided in .env
const port = process.env.PORT || 5000;

// Database connection
connectDB();

// Allowed origins for CORS
const allowedOrigins = [
  "https://main.d1sj7cd70hlter.amplifyapp.com",
  "https://expense-tracker-app-three-beryl.vercel.app",
  "http://localhost:3000", // Allow localhost during development
];

// Middleware
app.use(express.json());
app.use(cors());

//   {
  //     origin: "*",
  //     allowedHeaders: ['Access-Control-Allow-Origin'],
  //   // origin: (origin, callback) => {
  //   //   // Allow requests with no origin (e.g., mobile apps or curl)
  //   //   if (!origin || allowedOrigins.includes(origin)) {
  //   //     callback(null, true);
  //   //   } else {
  //   //     callback(new Error("Not allowed by CORS"));
  //   //   }
  //   // },
  //   credentials: true,
  //   methods: ["GET", "POST", "PUT", "DELETE"],
  // }
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API routes
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred.",
    error: err.message,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
