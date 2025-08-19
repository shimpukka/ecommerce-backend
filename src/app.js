import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api", routes);

// Error handler
app.use(errorHandler);

export default app;
