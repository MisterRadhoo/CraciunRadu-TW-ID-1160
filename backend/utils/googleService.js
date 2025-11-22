import "dotenv/config";
import { google } from "googleapis";
import { User } from "../model/index.js";

class GoogleService {
  /*---Implementare client OAuth2 pentru user---*/
  static async getGoogleClient(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) throw new Error("UserId inexistent!");
      if (
        !process.env.GOOGLE_CLIENT_ID ||
        !process.env.GOOGLE_CLIENT_SECRET ||
        !process.env.GOOGLE_REDIRECT_URI
      ) {
        throw new Error("404");
      }
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );
      const tokenExpire = Number(user.googleTokenExpire);

      oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken,
        expiry_date: tokenExpire,
      });
      if (!user.googleAccessToken || tokenExpire < Date.now()) {
        console.log("Token-uri Google reimprospatate!");

        const { credentials } = await oauth2Client.refreshToken(
          user.googleRefreshToken
        );
        oauth2Client.setCredentials(credentials);
        const updates = {
          googleAccessToken: credentials.access_token,
          googleTokenExpire: credentials.expiry_date,
        };
        if (credentials.refresh_token) {
          updates.googleRefreshToken = credentials.refresh_token;
        }
        await user.update(updates);
        console.log("Token Google reimprospatat cu succes!");
      }
      return oauth2Client;
    } catch (err) {
      console.error("Eroare la preluare Google Client:", err.message);
      throw new Error(`Autentificare Google esuata: ${err.message}`);
    }
  }
  /*---Implementare event Google Calendar----*/
  static async createGoogleEvent(userId, appointment) {
    try {
      const oauth2Client = await this.getGoogleClient(userId);
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const startDate = new Date(appointment.startTime);
      const endDate = new Date(appointment.endTime);

      if (isNaN(startDate) || isNaN(endDate)) {
        throw new Error("Data event-ului este invalida.");
      }

      const event = {
        summary: appointment.title,
        description: appointment.description || "",
        start: {
          dateTime: startDate.toISOString(),
          timeZone: "Europe/Bucharest",
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: "Europe/Bucharest",
        },
        location: appointment.location || undefined,
      };

      const response = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
        sendUpdates: "none",
      });
      console.log("Event creat in Google Calendar: ", response.data.id);
      return response.data.id;
    } catch (err) {
      console.error("Eroare la creare event Google:", err.message);
      throw new Error(
        `Nu s-a putut crea event-ul in Google Calendar: ${err.message}`
      );
    }
  }
  /*-----Actualizare event din google calendar----*/
  static async updateGoogleEvent(userId, eventId, updateData) {
    try {
      if (!eventId) throw new Error("Lipseste id-ul eventu-ului Google.");
      const oauth2Client = await this.getGoogleClient(userId);
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      //@ts-IGNORE
      await calendar.events.update({
        calendarId: "primary",
        eventId,
        resource: updateData,
      });
      console.log(`Event actualizact: ${eventId}`);
      return true;
    } catch (err) {
      console.error("Erroare la actualizare eveniment:", err.message);
      throw new Error(`Actualizare event Google esuata: ${err.message}`);
    }
  }
  /*-----Stergere event din google calendar---*/
  static async deleteGoogleEvent(userId, eventId) {
    try {
      if (!eventId) throw new Error("Lipseste id-ul eventu-ului Google.");
      const oauth2Client = await this.getGoogleClient(userId);
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      await calendar.events.delete({
        calendarId: "primary",
        eventId,
      });

      console.log(`Event sters din Google Calendar: ${eventId}`);
      return true;
    } catch (err) {
      if (err.code === 404) {
        console.warn("Eventul nu mai exista in Calendar.");
        return false;
      }
      console.error("Eroare la stergere event:", err.message);
      throw new Error(
        `Stergere event din Google Calendar esuat: ${err.message}`
      );
    }
  }
}

export default GoogleService;
