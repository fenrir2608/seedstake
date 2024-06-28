import User from "../Models/UserModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const userVerification = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ status: false, message: 'Authentication required' });
  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.status(401).json({ status: false, message: 'Invalid token' });
    } else {
      const user = await User.findById(data.id);
      if (user) {
        req.user = user; // Attach user to request object
        req.isAdmin = user.isAdmin; // Attach admin status to request object
        next();
      } else {
        return res.status(401).json({ status: false, message: 'User not found' });
      }
    }
  });
};

// export const userVerification = async (req, res) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.json({ status: false });
//   }

//   jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
//     if (err) {
//       return res.json({ status: false });
//     } else {
//       const user = await User.findById(data.id);
//       if (user) {
//         return res.json({ status: true, user: user.username, isAdmin : user.isAdmin });
//       } else {
//         return res.json({ status: false });
//       }
//     }
//   });
// };
