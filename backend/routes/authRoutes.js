import express from "express";
import AuthCtrl from "../controller/authCtrl.js";
import authorize from "../middleware/authMiddleware.js";
//import checkCookieToken from "../middleware/cookieToken.js";

const router = express.Router();

//router.post("/register", AuthCtrl.register);
router.post("/login", AuthCtrl.login);
router.post("/refresh", AuthCtrl.refresh);
router.post("/logout", AuthCtrl.logout);

export default router;
