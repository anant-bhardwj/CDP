import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { upload } from "../middleware/uploadRoute.js";
//import controllers here
import {
  datasetInfo,
  createDataset,
  getTableInfo,
  runQuery,
  uploadCSV,
} from "../controllers/query.controller.js";

const router = express.Router();

//create-dataset api call expects only the user id in req
// created a separate util file for automatic creation of dataset
// this route can still be used to manually create dataset for users without dataset using postman
router.post("/create-dataset", protectRoute, createDataset);

//uploadCSV controller expects user id from protected routes, file to be uploaded,
//a tableName selected by the user. Use the mullter middleware as well for parsing csv file
{
  /* <form action="/api/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="csvFile" />
  <button type="submit">Upload</button>
</form> */
}
// this is where the "csvFile" in the upload middleware comes from
//it is the fieldname in which the csv file is added in the frontend
router.post("/upload-table", protectRoute, upload.single("csvFile"), uploadCSV);

//to get list of tablenames in a dataset
router.get("/dataset-info", protectRoute, datasetInfo);

//to get schema and preview of individual table
router.post("/table-info", protectRoute, getTableInfo);

//to run a  query
router.post("/run-query", protectRoute, runQuery);

export default router;
