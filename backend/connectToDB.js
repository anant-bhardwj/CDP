import mysql from "mysql2";

const connectToDB = () => {
  try {
    const pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "password",
      database: "cdp_database",
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    pool.getConnection((error, connection) => {
      if (error) {
        console.error("Error connecting to database", error.message);
        process.exit(1);
      } else {
        console.log("Successfully connected to database");
        connection.release();
      }
    });
    return pool.promise();
  } catch (error) {
    console.log("Error in connecting to database", error.message);
    process.exit(1);
  }
};

export default connectToDB;
