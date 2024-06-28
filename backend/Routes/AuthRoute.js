import { Router } from "express";
import { Login, Logout, Reset, Signup, Update } from "../Controllers/AuthController.js";
import { userVerification } from "../Middlewares/AuthMiddleware.js";

const router = Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.get('/verify', userVerification, (req, res) => {
    res.status(200).json({ status: true, user: req.user.username, isAdmin: req.user.isAdmin });
  });
router.post("/reset", Reset);
router.put("/reset/:token", Update)

export default router;
