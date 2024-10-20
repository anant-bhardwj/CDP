import getBigQuery from "../connectToBigquery.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//create-dataset controller
//used when new user signup, automatically creates a dataset for them
//havent added into the signup controller yet. as of now no automatic creation on signup
//consider adding a create dataset button on frontend if no dataset exists
export const createDataset = async (req, res) => {
  try {
    const userId = req.user.id;
    const datasetId = `user_${userId}_dataset`;

    const bigquery = getBigQuery();

    const [datasetExists] = await bigquery.dataset(datasetId).exists();

    if (datasetExists) {
      console.log("Dataset already exists");
      return res
        .status(400)
        .json({ error: `Dataset ${datasetId} already exists` });
    }

    await bigquery.createDataset(datasetId, { location: "US" });

    console.log("Dataset Created successfully");

    res.status(200).json({ message: "Dataset Created successfully" });
  } catch (error) {
    console.error("Error in creating Dataset: ", error.message);
    res.status(500).json({ message: "Failed to create Dataset" });
  }
};

//uploading csv data
//creates the table in the users personal dataset

export const uploadCSV = async (req, res) => {
  try {
    const userId = req.user.id;

    const file = req.file;

    if (!file) {
      console.log("Error in uploadCSV controller. No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { tableName } = req.body;
    if (!tableName) {
      console.log("Error in uploadCSV controller. No tableName given");
      return res.status(400).json({ error: "Table name required" });
    }

    const csvFilePath = path.join(__dirname, "../uploads", file.filename);

    const datasetId = `user_${userId}_dataset`;

    const bigquery = getBigQuery();

    const [datasetExists] = await bigquery.dataset(datasetId).exists();
    if (!datasetExists) {
      await bigquery.createDataset(datasetId, { location: "US" });
      console.log(`Dataset ${datasetId} created`);
    }

    //check if table already exists with same name
    const [tableExists] = await bigquery
      .dataset(datasetId)
      .table(tableName)
      .exists();

    if (tableExists) {
      console.log("Table already  exists");
      return res
        .status(400)
        .json({ error: `Table ${tableName} already exists` });
    }

    //Loading the csv into bigquery
    const [job] = await bigquery
      .dataset(datasetId)
      .table(tableName)
      .load(csvFilePath, { skipLeadingRows: 1, autodetect: true });

    console.log(`Table ${tableName} created. Job status: ${job.status}`);

    return res.status(200).json({
      message: `Table ${tableName} created and data uploaded.`,
      tableName,
      datasetId,
    });
  } catch (error) {
    console.log("Error uploading CSV file: ", error);
    return res
      .status(500)
      .json({ error: "Internal server error while uploading CSV" });
  } finally {
    //clean up the uploaded file from server side
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

//fetching dataset info and name of tables in each dataset
//only needs userId that it gets into the req from protectRoute
export const datasetInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const datasetId = `user_${userId}_dataset`;

    const bigquery = getBigQuery();

    const [datasetExists] = await bigquery.dataset(datasetId).exists();
    if (!datasetExists) {
      console.log("Error in getting dataset info. Dataset does not exist");
      return res.status(400).json({ error: "Dataset not found" });
    }

    const [tables] = await bigquery.dataset(datasetId).getTables();

    if (!tables || tables.length === 0) {
      console.log("No tables in selected dataset");
      return res
        .status(400)
        .json({ message: "No tables found in the dataset" });
    }

    const tableNames = tables.map((table) => table.id);

    console.log(`Found ${tables.length} tables in Dataset`, tableNames);

    return res.status(200).json({
      message: `Found ${tables.length} tables in Dataset`,
      tables: tableNames,
    });
  } catch (error) {
    console.log("Error fetching dataset info: ", error);
    return res
      .status(500)
      .json({ error: "Internal server error fetching dataset info" });
  }
};

//running a query
//gives response of query, bunch of data to be displayed
export const runQuery = async (req, res) => {
  try {
    const userId = req.user.id;

    const datasetId = `user_${userId}_dataset`;
    const { tableName, query } = req.body;

    if (!tableName || !query) {
      console.log("Table ID and query needed");
      return res.status(400).json({ error: "Table ID and query needed" });
    }

    const bigquery = getBigQuery();

    const [tableExists] = await bigquery
      .dataset(datasetId)
      .table(tableName)
      .exists();

    if (!tableExists) {
      return res
        .status(400)
        .json({ error: `Table ${tableName} does not exist` });
    }

    const options = {
      query: query,
      location: "US",
    };

    const [job] = await bigquery.createQueryJob(options);
    console.log(`Query job started.`);

    const [rows] = await job.getQueryResults();
    console.log("Query results generated: ", rows);

    return res.status(200).json({ message: "Query successful", data: rows });
  } catch (error) {
    console.error("Error running the query: ", error);
    return res.status(500).json({ error: "Error running query" });
  }
};

//fetching the metadata of a table
//including the schema, column names, number of rows etc.

//deleting a table from the dataset

//clearing the users entire dataset

//saving the query generated data in a csv or excel file
//not sure if need controller
//probably do this on the frontend only??? Gotta check
