import express from "express";
import authorize from "../middleware/authMiddleware.js";
import userCtrl from "../controller/userCtrl.js";
//import { checkCookieToken } from "../middleware/cookieToken.js";

const router = express.Router();

//rute publice, fara JWT
router.get("/:id", userCtrl.getUserId);
router.post("/", userCtrl.addUser);

//rute protejate/private JWT
router.patch("/:id", authorize, userCtrl.updateUser);
router.delete("/:id", authorize, userCtrl.deleteUser);

export default router;
