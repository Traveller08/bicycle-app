import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";
export const verifyJwtToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
      // console.log(" no token");
      return res.status(401).json({ message: 'Access denied. Token missing.' });
    }
    try {
      // console.log("  token");
      const secret_key = process.env.SECRET_KEY;
      const decoded = jwt.verify(token,secret_key); 
      
      req.user = decoded.username;
      req.usertype = decoded.usertype;
      req.id = decoded.id;
      // console.log(" user token at jwt verfication-> ", req.user, req.usertype, req.id);

      } 
      catch (error) {
        return res.status(401).json({ message: 'Access denied. Invalid token.' });
      }
    next();
  };
  