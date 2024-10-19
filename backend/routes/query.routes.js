import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { upload } from "../middleware/uploadRoute.js";
//import controllers here
import { createDataset, uploadCSV } from "../controllers/query.controller.js";

const router = express.Router();

//create-dataset api call expects only the user id in req
router.post("/create-dataset", protectRoute, createDataset);

//uploadCSV controller expects user id from protected routes, file to be uploaded,
//a tableName selected by the user. Use the mullter middleware as well for parsing csv file
// uploadCSV
{
  /* <form action="/api/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="csvFile" />
  <button type="submit">Upload</button>
</form> */
}
// this is where the "csvFile" in the upload middleware comes from
//it is the fieldname in which the csv file is added in the frontend
router.post("/upload-table", protectRoute, upload.single("csvFile"), uploadCSV);

export default router;
