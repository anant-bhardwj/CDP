import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import cookieParser from "cookie-parser";
import connectToDB from "./connectToDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

const startServer = async () => {
  try {
    connectToDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server: ", error.message);
    process.exit(1);
  }
};

startServer();
