import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

import userRoutes from "./Routes/user.js";
import bicycleRoutes from "./Routes/bicycle.js";
import rentRequestRoutes from "./Routes/rentRequest.js";
import returnRequestRoutes from "./Routes/returnRequest.js";
import rentalRoutes from "./Routes/rental.js";

import mysql2 from "mysql2";

import {
  db,
  createUsersTable,
  createBicyclesTable,
  createRentRequestsTable,
  createRentalsTable,
  createReturnRequestsTable,
} from "./util/db.js";

app.use("/api/user", userRoutes);
app.use("/api/bicycle", bicycleRoutes);
app.use("/api/rentRequest", rentRequestRoutes);
app.use("/api/returnRequest", returnRequestRoutes);
app.use("/api/rental", rentalRoutes);

const initDB = async () => {
  try {
    const connection = await mysql2.createConnection(db);
    await connection.promise().query(createUsersTable());
    connection.commit();

    await connection.promise().query(createBicyclesTable());
    connection.commit();

    await connection.promise().query(createRentRequestsTable());
    connection.commit();

    await connection.promise().query(createRentalsTable());
    connection.commit();

    await connection.promise().query(createReturnRequestsTable());
    connection.commit();

    console.log("DB initialized...");
  } 
  catch (error) {
    console.log("Database initialization failed...");
    console.log(error);
  }
};

app.listen(6001, async () => {
  await initDB();
  console.log("App listening on port 6001");
});
