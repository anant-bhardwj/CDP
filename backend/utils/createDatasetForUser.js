import getBigQuery from "../connectToBigquery.js";

export const createDatasetForUser = async (userId) => {
  try {
    const datasetId = `user_${userId}_dataset`;

    const bigquery = getBigQuery();

    const [datasetExists] = await bigquery.dataset(datasetId).exists();

    if (datasetExists) {
      console.log(`Dataset ${datasetId} already exists`);
      return { success: false, message: `Dataset ${datasetId} already exists` };
    }

    await bigquery.createDataset(datasetId, { location: "US" });

    console.log("Dataset created successfully");
    return { success: true, message: "Dataset created successfully" };
  } catch (error) {
    console.error("Error in creating Dataset: ", error.message);
    throw new Error("Failed to create Dataset");
  }
};
