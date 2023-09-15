import express from "express";
import {
  db,
  insertIntoReturnRequestsTable,
  updateReturnRequestStatus
} from "../util/db.js";
import mysql2 from "mysql2";
import { verifyJwtToken } from "../middleware/verify_jwt_token.js";
import { verifyAdmin } from "../middleware/verify_admin.js";
const router = express.Router();
import { generateId } from "../util/id.js";

router.post("/addReturnRequest", verifyJwtToken, async (req, res) => {
  const { rentalId } = req.body;
  const requestCreatedTime = Date.now();
  const userId = req.id; // can also be obtained from rental table using rentalId 

  try {
    const connection = await mysql2.createConnection(db);
    try {
      const returnId = generateId();
      const returnStatus = "Pending";
      
      // add check if does not exist in rental table then invalid 

      await connection
        .promise()
        .query(
          insertIntoReturnRequestsTable(
            returnId,
            rentalId,
            returnStatus,
            requestCreatedTime,
            null,
            null
          )
        );
      connection.commit();

      const [returnRequest] = await connection
        .promise()
        .query(`SELECT * FROM return_requests WHERE return_id='${returnId}'`);

      return res.status(200).json({
        message: "Return request added successfully",
        data: returnRequest[0],
      });
    } catch (error) {
      console.log("Error ", error);
      return res.status(500).json({ message: "Internal server error" });
    } finally {
      connection.close();
    }
  } catch (error) {
    console.log("Error ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/validateReturnRequest", verifyJwtToken, verifyAdmin, async (req, res) => {
    const { returnId, requestStatus } = req.body; // can be Approved
    const adminId = req.id;
    const requestApprovedTime = Date.now();

    try {
      const connection = await mysql2.createConnection(db);
      try {
        const [returnRequest] = await connection
          .promise()
          .query(`SELECT * FROM return_requests WHERE return_id='${returnId}'`);

        if (returnRequest.length === 0) {
          return res.status(404).json({ message: "Return request not found" });
        }

        // Check if the request is pending and only pending requests can be resolved
        if (returnRequest[0].return_status !== "Pending") {
          return res
            .status(400)
            .json({ message: "Invalid return request status" });
        }

        await connection
          .promise()
          .query(
            updateReturnRequestStatus(
              returnId,
              requestStatus,
              adminId,
              requestApprovedTime
            )
          );
        connection.commit();

        // Handle if the return request is approved
        if (requestStatus === "Approved") {
          // Update the status and rental_end_date in the rentals table
          await connection
            .promise()
            .query(
              `UPDATE rentals SET status='completed', rental_end_date=${requestApprovedTime} WHERE rental_id='${returnRequest[0].rental_id}'`
            );

          // Calculate rental_cost (you need to calculate the rental_cost based on the rental_start_date and rental_end_date and update it in the rentals table)
          // Retrieve bicycle_id from the rentals table
          const [rental] = await connection
            .promise()
            .query(
              `SELECT bicycle_id, rental_start_date FROM rentals WHERE rental_id='${returnRequest[0].rental_id}'`
            );
          const bicycleId = rental[0].bicycle_id;
          const rentalStartDate = rental[0].rental_start_date;

          // Retrieve cost_per_hour from the bicycles table
          const [bicycle] = await connection
            .promise()
            .query(
              `SELECT cost_per_hour FROM bicycles WHERE bicycle_id='${bicycleId}'`
            );
          const costPerHour = bicycle[0].cost_per_hour;
          
          // Calculate rental_cost based on rental_start_date and rental_end_date
          const rentalEndDate = requestApprovedTime;

          const durationInMilliseconds = rentalEndDate - rentalStartDate;
          const durationInHours = durationInMilliseconds / (1000 * 60 * 60);
          const rentalCost = durationInHours * costPerHour;
          
          // Update rental_cost in the rentals table
          await connection
            .promise()
            .query(
              `UPDATE rentals SET rental_cost=${rentalCost} WHERE rental_id='${returnRequest[0].rental_id}'`
            );


          // Make the bicycle available again
          await connection
            .promise()
            .query(
              `UPDATE bicycles SET available=true WHERE bicycle_id='${bicycleId}'`
            );
        }

        const [updatedReturnRequest] = await connection
          .promise()
          .query(`SELECT * FROM return_requests WHERE return_id='${returnId}'`);

        return res.status(200).json({
          message: "Return request validated successfully",
          data: updatedReturnRequest[0],
        });
      } catch (error) {
        console.log("Error ", error);
        return res.status(500).json({ message: "Internal server error" });
      } finally {
        connection.close();
      }
    } catch (error) {
      console.log("Error ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/getPendingReturnRequestUser", verifyJwtToken, async (req, res) => {
  const userId = req.id;

  try {
    const connection = await mysql2.createConnection(db);
    try {
      const [returnRequests] = await connection
        .promise()
        .query(
          // `SELECT return_requests.*
          // FROM return_requests
          // JOIN rentals ON return_requests.rental_id = rentals.rental_id
          // WHERE return_requests.return_status = 'Pending' AND rentals.user_id = '${userId}';`
          `SELECT return_requests.*, bicycles.bicycle_name, bicycles.cost_per_hour
          FROM return_requests
          JOIN rentals ON return_requests.rental_id = rentals.rental_id
          JOIN bicycles ON rentals.bicycle_id = bicycles.bicycle_id
          WHERE return_requests.return_status = 'Pending' AND rentals.user_id = '${userId}';`
        );

      return res
        .status(200)
        .json({
          message: "Pending return requests fetched successfully",
          data: returnRequests,
        });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    } finally {
      connection.close();
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get( "/getPendingReturnRequestAdmin", verifyJwtToken, verifyAdmin, async (req, res) => {
    try {
      const connection = await mysql2.createConnection(db);
      try {
        const [returnRequests] = await connection
          .promise()
          // .query('SELECT * FROM return_requests WHERE return_status="Pending" ORDER BY request_created_time DESC');
          .query(

            `SELECT return_requests.*, bicycles.bicycle_id, bicycles.bicycle_name, rentals.user_id
          FROM return_requests
          JOIN rentals ON return_requests.rental_id = rentals.rental_id
          JOIN bicycles ON rentals.bicycle_id = bicycles.bicycle_id
          WHERE return_requests.return_status = 'Pending'
          ORDER BY return_requests.request_created_time DESC`

          )

        return res
          .status(200)
          .json({
            message: "Pending return requests fetched successfully",
            data: returnRequests,
          });
      } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
      } finally {
        connection.close();
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);


router.get("/getApprovedReturnRequests", verifyJwtToken, verifyAdmin, async (req, res) => {
  try {
    const connection = await mysql2.createConnection(db);
    try {
      const [approvedReturnRequests] = await connection
        .promise()
        .query(`
        SELECT
        return_requests.return_id,
        return_requests.rental_id,
        return_requests.return_status,
        return_requests.request_created_time as return_created_time,
        return_requests.request_approved_time as return_approved_time,
        return_requests.approved_by_admin_id as return_approved_by_admin_id,
        rent_requests.approved_by_admin_id as rent_approved_by_admin_id,
        rent_requests.request_date as rent_created_time,
        rent_requests.request_approved_time as rent_approved_time,
        rentals.user_id,
        rentals.bicycle_id,
        rentals.rental_cost,
        rent_requests.request_id,
        users.firstName,
        users.lastName,
        users.username,
        bicycles.bicycle_name,
        bicycles.cost_per_hour
      FROM
        return_requests
        JOIN rentals ON return_requests.rental_id = rentals.rental_id
        JOIN rent_requests ON rentals.request_id = rent_requests.request_id
        JOIN users ON rentals.user_id = users.id
        JOIN bicycles ON rentals.bicycle_id = bicycles.bicycle_id
      WHERE
        return_requests.return_status = 'Approved'
      `);


      return res.status(200).json({
        message: "Approved return requests fetched successfully",
        data: approvedReturnRequests,
      });
    } catch (error) {
      console.log("error -> ", error);
      return res.status(500).json({ message: "Internal server error" });
    } finally {
      connection.close();
    }
  } catch (error) {
    console.log("error connecting to database -> ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
