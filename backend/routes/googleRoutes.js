import express from "express";
import GoogleService from "../utils/googleService.js";
import { Appointment } from "../model/index.js";
import authorize from "../middleware/authMiddleware.js";
//import { checkCookieToken } from "../middleware/cookieToken.js";

const router = express.Router();

//sincronizare cu Google Calendar(appointments)
router.post("/sync/:appointmentId", authorize, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: { id: req.params.appointmentId, userId: req.user.id },
    });
    if (!appointment) {
      return res
        .status(404)
        .json({ error: "Programarea nu exista dupa id-ul specificat." });
    }

    //implementare googleEvent in calendar
    const googleEventId = await GoogleService.createGoogleEvent(
      req.user.id,
      appointment
    );
    await appointment.update({ googleCalendarEventId: googleEventId });
    res.status(201).json({
      message: `Programarea cu id-ul: ${req.params.appointmentId} sincronizata cu Google Calendar.`,
    });
  } catch (err) {
    console.error("Eroare sync Google:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put("/sync/:appointmentId", authorize, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: { id: req.params.appointmentId, userId: req.user.id },
    });
    if (!appointment || !appointment.googleCalendarEventId) {
      return res.status(404).json({ error: "Event Google nesincronizat." });
    }

    await GoogleService.updateGoogleEvent(
      req.user.id,
      appointment.googleCalendarEventId,
      {
        summary: req.body.title || appointment.title,
        description: req.body.description || appointment.description,
        start: {
          dateTime: appointment.startTime,
          timeZone: "Europe/Bucharest",
        },
        end: {
          dateTime: appointment.endTime,
          timeZone: "Europe/Bucharest",
        },
      }
    );
    res.json({ message: "Event Google actualizat!" });
  } catch (err) {
    console.error("Eroare update appointment, Google Calendar:", err.message);
    res.status(500).json({ error: err.message });
  }
});

//sterge eventGoogleId din google calendar
router.delete("/sync/:appointmentId", authorize, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: { id: req.params.appointmentId, userId: req.user.id },
    });
    if (!appointment || !appointment.googleCalendarEventId) {
      return res
        .status(404)
        .json({ error: "Event-ul Google inexistent sau nesincronizat." });
    }
    await GoogleService.deleteGoogleEvent(
      req.user.id,
      appointment.googleCalendarEventId
    );
    await appointment.update({ googleCalendarEventId: null });
    res.json({ meessage: "Event Google sters din calendar." });
  } catch (err) {
    console.error(
      "Eroare la stergere event din Google Calendar:",
      err.meessage
    );
    res.status(500).json({ error: err.meessage });
  }
});

export default router;
