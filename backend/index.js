import express from "express";
import dotenv from "dotenv";
import getBigQuery from "./connectToBigquery.js";
import routes from "./routes/routes.js";
import cookieParser from "cookie-parser";
import connectToDB from "./connectToDB.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

const connectToBigquery = async () => {
  try {
    const bigquery = getBigQuery();

    const [datasets] = await bigquery.getDatasets();

    if (datasets.length > 0) {
      console.log(`Connected to BigQuery. Found ${datasets.length} datasets`);
    } else {
      console.log(`Connected to BigQuery. Found no datasets`);
    }
  } catch (error) {
    console.log(`Error connecting to BigQuery: `, error);
    throw new Error("Error connecting to BigQuery");
  }
};

const startServer = async () => {
  try {
    connectToDB();
    await connectToBigquery();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server: ", error.message);
    process.exit(1);
  }
};

startServer();
