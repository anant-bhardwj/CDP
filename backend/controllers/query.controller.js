import getBigQuery from "../connectToBigquery.js";

//create-dataset controller
//used when new user signup, automatically creates a dataset for them
export const createDataset = async (req, res) => {
  try {
    const userId = req.user.id;
    const datasetId = `user_${userId}_dataset`;

    const bigquery = getBigQuery();
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

//running a query
//gives response of query, bunch of data to be displayed

//fetching the metadata of a table
//including the schema, column names, number of rows etc.

//deleting a table from the dataset

//clearing the users entire dataset

//saving the query generated data in a csv or excel file
//not sure if need controller
//probably do this on the frontend only??? Gotta check
