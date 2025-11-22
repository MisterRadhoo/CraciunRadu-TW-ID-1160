import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import GoogleService from "../utils/googleService.js";

const demoUserId = 1;

(async () => {
  try {
    const eventId = await GoogleService.createGoogleEvent(demoUserId, {
      title: "Demo event",
      description: "Event demo google calendar",
      date: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });

    console.log("EventId creat!", eventId);
    await GoogleService.updateGoogleEvent(demoUserId, eventId, {
      summary: "Event actualizat!",
    });

    await GoogleService.deleteGoogleEvent(demoUserId, eventId);
  } catch (err) {
    console.error("Eroare demo!", err.message);
  }
})();
