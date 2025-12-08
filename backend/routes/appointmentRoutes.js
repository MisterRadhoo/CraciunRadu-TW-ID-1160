import express from "express";
import AppointmentCtrl from "../controller/appointmentCtrl.js";
import authorize from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user/:userId", authorize, AppointmentCtrl.getAppointmentsByUserId);
router.post("/", authorize, AppointmentCtrl.createAppointment);
router.get("/:id", authorize, AppointmentCtrl.getAppointmentById);
router.patch("/:id", authorize, AppointmentCtrl.updateAppointment);
router.delete("/:id", authorize, AppointmentCtrl.deleteAppointment);

export default router;
