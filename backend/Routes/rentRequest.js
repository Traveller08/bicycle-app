import express from "express";
import {
  db,
  insertIntoRentRequestsTable,
  updateRentRequestStatus,
  // getRentRequestsDataPending,
  insertIntoRentalsTable,
} from "../util/db.js";

import mysql2 from "mysql2";
import { verifyJwtToken } from "../middleware/verify_jwt_token.js";
import { verifyAdmin } from "../middleware/verify_admin.js";
const router = express.Router();
import { generateId } from "../util/id.js";

router.post("/addRentRequest", verifyJwtToken, async (req, res) => {
  const { bicycleId } = req.body;
  const userId = req.id;
  const requestDate = Date.now();

  try {
    const connection = await mysql2.createConnection(db);
    try {
      const requestId = generateId(); 
      const requestStatus = "Pending";

      // Mark the bicycle as not available
      await connection
        .promise()
        .query(`UPDATE bicycles SET available = false WHERE bicycle_id = '${bicycleId}'`);

      // Create an entry in the rent request table
      await connection
        .promise()
        .query(insertIntoRentRequestsTable(requestId, userId, bicycleId, requestStatus, requestDate));
      connection.commit();

      const [rentRequest] = await connection
        .promise()
        .query(`SELECT * FROM rent_requests WHERE request_id='${requestId}'`);

      return res.status(200).json({ message: "Rent request added successfully", data: rentRequest[0]  });
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


router.get("/getPendingRentRequestAdmin", verifyJwtToken, verifyAdmin, async (req, res) => {
  try {
    const connection = await mysql2.createConnection(db);
    try {
      const [rentRequests] = await connection.promise().query(
        `
        SELECT
          rent_requests.*,
          bicycles.bicycle_name,
          bicycles.cost_per_hour
        FROM
          rent_requests
          JOIN bicycles ON rent_requests.bicycle_id = bicycles.bicycle_id
        WHERE
          rent_requests.request_status='Pending'
        `
      );

      return res.status(200).json({ message: "Pending rent requests fetched successfully", data: rentRequests });
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


router.post("/updateRentRequest", verifyJwtToken, verifyAdmin, async (req, res) => {
  const { requestId, requestStatus } = req.body; // can be Approved / Rejected 
  const adminId = req.id;
  const requestApprovedTime = Date.now();
  
  // console.log("no of requests with given id", requestId, requestStatus, rentRequest.length)
  try {
    const connection = await mysql2.createConnection(db);
    try {
      const [rentRequest] = await connection
        .promise()
        .query(`SELECT * FROM rent_requests WHERE request_id='${requestId}'`);
      
      if (rentRequest.length === 0) {
        return res.status(404).json({ message: "Rent request not found" });
      }

      // Check if the request is pending and only pending requests can be resolved
      if (rentRequest[0].request_status !== "Pending") {
        return res.status(400).json({ message: "Invalid request status" });
      }

      
      if (requestStatus === "Approved") {
          // If the request is approved, create a rental entry
          const rentalId = generateId();
          const rentalStartDate = requestApprovedTime;
          const rentalEndDate = null; // Will be updated when the bicycle is returned
          const rentalCost = null; // Will be calculated and updated when the bicycle is returned
          const rentalStatus = "Rented";
          
          await connection
            .promise()
            .query(
              insertIntoRentalsTable(
                rentalId,
                rentRequest[0].user_id,
                rentRequest[0].bicycle_id,

                requestId, // Pass the requestId here

                rentalStartDate,
                rentalEndDate,
                rentalCost,
                rentalStatus
              )
            );

        } 
        else if (requestStatus === "Rejected") {
          // If the request is rejected, mark the bicycle as available again
          await connection
            .promise()
            .query(`UPDATE bicycles SET available = true WHERE bicycle_id = '${rentRequest[0].bicycle_id}'`);
          
          connection.commit();
        }
        else {
          return res.status(401).json({ message: "Invalid Request Status" });
        }
        
        await connection
        .promise()
        .query(updateRentRequestStatus(requestId, requestStatus, adminId, requestApprovedTime));

  
        connection.commit();
  
        const [updatedRentRequest] = await connection
          .promise()
          .query(`SELECT * FROM rent_requests WHERE request_id='${requestId}'`);

      return res.status(200).json({ message: "Rent request resolved successfully", data: updatedRentRequest[0] });
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


router.get("/getPendingRentRequestUser", verifyJwtToken, async (req, res) => {
  const userId = req.id;

  try {
    const connection = await mysql2.createConnection(db);
    try {
      // const [rentRequests] = await connection
      //   .promise()
      //   .query(`SELECT * FROM rent_requests WHERE user_id='${userId}' AND request_status='Pending'`);
      const [rentRequests] = await connection
        .promise()
        .query(`
          SELECT
            rent_requests.*,
            bicycles.bicycle_name,
            bicycles.cost_per_hour
          FROM
            rent_requests
            JOIN bicycles ON rent_requests.bicycle_id = bicycles.bicycle_id
          WHERE
            rent_requests.user_id='${userId}' AND rent_requests.request_status='Pending'
        `);

      return res.status(200).json({ message: "Pending rent requests fetched successfully", data: rentRequests });
    } 
    catch (error) {
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

router.get("/adminRequests", verifyJwtToken, verifyAdmin, async (req, res) => {
  const adminId = req.id;

  try {
    const connection = await mysql2.createConnection(db);
    try {
      const [adminRequests] = await connection
        .promise()
        .query(
          `
          SELECT
            rent_requests.*,
            bicycles.bicycle_name
          FROM
            rent_requests
            JOIN bicycles ON rent_requests.bicycle_id = bicycles.bicycle_id
          WHERE
            rent_requests.request_status='Approved'
        `
        );

      return res.status(200).json({ message: "Approved rent requests fetched successfully", data: adminRequests });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    } finally {
      connection.close();
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
