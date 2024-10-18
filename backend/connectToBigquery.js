import { BigQuery } from "@google-cloud/bigquery";

const getBigQuery = () => {
  return new BigQuery({
    keyFilename: process.env.KEY_FILE_NAME,
    projectId: "cdp1-439017",
  });
};

export default getBigQuery;
