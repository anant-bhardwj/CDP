import express from "express";
import dotenv from "dotenv";
import { BigQuery } from "@google-cloud/bigquery";
import routes from "./routes/routes.js";
import cookieParser from "cookie-parser";
import connectToDB from "./connectToDB.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const bigquery = new BigQuery({
  keyFilename: process.env.KEY_FILE_NAME,
  projectId: "cdp1-439017",
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
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

app.get("/test-bigquery", async (req, res) => {
  try {
    // Test the connection by listing datasets in the BigQuery project
    const [datasets] = await bigquery.getDatasets();

    // If the connection is successful, send the dataset list or confirmation message
    if (datasets.length > 0) {
      console.log("Connected to bigquery");
      res
        .status(200)
        .json({
          message: `Connected to BigQuery. Found ${datasets.length} datasets.`,
        });
    } else {
      console.log("Connected to bigquery");
      res
        .status(200)
        .json({ message: "Connected to BigQuery. No datasets found." });
    }
  } catch (error) {
    console.error("Error connecting to BigQuery:", error);
    res.status(500).json({ message: "Error connecting to BigQuery", error });
  }
});

startServer();
