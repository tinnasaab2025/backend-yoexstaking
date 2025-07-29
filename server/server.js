import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
dotenv.config();
import mainRoute from "./routes/index.js";
import { ERROR } from "./config/AppConstants.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var app = express();
app.set('trust proxy', 'loopback'); // Or use a specific IP or subnet
// 🛡️ Create rate limiter middleware
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
//   standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
//   legacyHeaders: false, // Disable `X-RateLimit-*` headers
// });

// ⛑️ Apply limiter to all routes
app.use(helmet());
// app.use(limiter);



// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");
// app.use("/uploads", express.static("uploads"));

let whitelist = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://yoexstaking.com",
  "https://yoexstaking.io",
  "https://yoex.pro",
  "https://yoex.org",
  "https://yoex.uk",
  "https://vg-there-gis-invasion.trycloudflare.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl)
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy blocked: ${origin}`));

    }
  },
  credentials: true,
};

// CORS Middleware
app.use(cors(corsOptions));

// 🔥 Add this to handle OPTIONS preflight
// app.options('*', cors(corsOptions));


app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

app.use(mainRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let finalResponse = { ...ERROR.dataNotFound };
  finalResponse.message = 'Not found';
  finalResponse.statusCode = 404
  return res.status(ERROR.dataNotFound.statusCode).json(finalResponse);
  // next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;