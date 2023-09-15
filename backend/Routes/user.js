import express from "express";
import { db, getUserDetails, insertIntoUsers } from "../util/db.js";
import { generateAccessToken } from "../util/jwt_token.js";
import { compareHash, generateHash } from "../util/password.js";
import mysql2 from "mysql2";
import { verifyLoginDetails } from "../middleware/verify_login_details.js";
import { verifyJwtToken } from "../middleware/verify_jwt_token.js";
import { verifyUserDetails } from "../middleware/verify_user_details.js";

const router = express.Router();

router.post("/login", verifyLoginDetails, async (req, res) => {
  const { username, password, usertype } = req.body;
  console.log("login ", req.body);
  try {
    const connection = await mysql2.createConnection(db);
    const query = `SELECT * FROM users WHERE username = '${username}' and usertype='${usertype}' LIMIT 1`;
    const [rows] = await connection.promise().query(query);
    if (rows.length === 1) {
      const hashedPassword = rows[0].password;
      const passwordMatch = await compareHash(password, hashedPassword);
      if (passwordMatch) {
        const payload = {
          username: rows[0].username,
          usertype: usertype,
          id : rows[0].id 
        };

        const token = generateAccessToken(payload);
        return res
          .status(200)
          .json({ message: "login successful", token: token });
      }
    }
    return res.status(401).json({ message: "invalid credentials" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/register", verifyUserDetails, async (req, res) => {
  console.log("req : ", req.body);
  const {
    firstName,
    lastName,
    username,
    password,
    usertype,
  } = req.body;
  
  try {
    const connection = await mysql2.createConnection(db);
    try {
      const hashedPassword = await generateHash(password);
      const checkUserQuery = `select * from users where username='${username}' and usertype='${usertype}'`;
      const [rows] = await connection.promise().query(checkUserQuery);

      if (rows.length > 0) {
        return res
          .status(400)
          .json({ message: "user with given username already exists" });
      }

      const query = insertIntoUsers(
        firstName,
        lastName,
        username,
        hashedPassword,
        usertype
      );
      await connection.promise().query(query);
      connection.commit();
      return res.status(200).json({ message: "User registered successfully" });
    } 
    catch (error) {
      console.log("error ", error);
      return res.status(500).json({ message: "Internal server error" });
    } 
    finally {
      connection.close();
    }
  } 
  catch (error) {
    console.log("error ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/profile", verifyJwtToken,  async (req, res) => {
  const username = req.user;
  const usertype = req.usertype;
  const id = req.id;
  console.log(username , usertype , id);
  
  try {
    const connection = await mysql2.createConnection(db);
    try {
      const query = `SELECT * FROM users where id='${id}'`;
      const [rows] = await connection.promise().query(query);

      if (rows.length == 1) {

        return res.status(200).json({ status: "success", data: rows[0] });
      }
      return res.status(200).json({ status: "failed", data: "" });
    } catch (error) {
      return res.status(500).json({ message: "internal server error" });
    } finally {
      connection.close();
    }
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

export default router;
