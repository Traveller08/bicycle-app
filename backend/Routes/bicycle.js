import express from "express";
import { db, insertIntoBicyclesTable, getAllBicyclesData } from "../util/db.js";
import mysql2 from "mysql2";
import { verifyJwtToken} from "../middleware/verify_jwt_token.js";
import { verifyAdmin } from "../middleware/verify_admin.js";
const router = express.Router();
import { generateId } from "../util/id.js";

router.post("/add", verifyJwtToken, async (req, res) => {
  const { bicycleName, costPerHour } = req.body;
  const addedByUserId = req.id;
  const createdTime  = Date.now();
  console.log("bicycle details ->", bicycleName , costPerHour);
  try {
    const connection = await mysql2.createConnection(db);
    try {
      const bicycleId = generateId();
      
      // by default available = true when inserted 
      await connection
        .promise()
        .query(
          insertIntoBicyclesTable(
            bicycleId,
            bicycleName,
            addedByUserId,
            costPerHour,
            createdTime
          )
        );
      connection.commit();
      
      const [bicycle] = await connection
        .promise()
        .query(`SELECT * FROM bicycles WHERE bicycle_id='${bicycleId}'`);

      return res.status(200).json({ message: "Bicycle added successfully", data: bicycle[0] });
    } 
    catch (error) {
      console.log("Error ", error);
      return res.status(500).json({ message: "Internal server error" });
    } 
    finally {
      connection.close();
    }
  } 
  catch (error) {
    console.log("Error ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/all", verifyJwtToken , verifyAdmin , async (req, res) => { // for admin to check the status of all bicycles 
  try {
    const connection = await mysql2.createConnection(db);
    try {
      const [bicycles] = await connection.promise().query(getAllBicyclesData());

      return res
        .status(200)
        .json({ message: "Bicycles fetched successfully", data: bicycles });
    } 
    catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    } 
    finally {
      connection.close();
    }
  } 
  catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/available", async (req, res) => { 
  try {
    const connection = await mysql2.createConnection(db);
    try {
      const [bicycles] = await connection.promise().query(`SELECT * FROM bicycles WHERE available=true`);

      return res.status(200).json({ message: "Available bicycles fetched successfully", data: bicycles });
    } 
    catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    } 
    finally {
      connection.close();
    }
  } 
  catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});



export default router;
