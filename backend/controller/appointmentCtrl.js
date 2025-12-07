import { Appointment, User } from "../model/index.js";

class AppointmentCtrl {
  /*---POST /api/appointment---*/
  static async createAppointment(req, res) {
    try {
      let { title, description, startTime, endTime, location } = req.body;

      if (!title || !startTime) {
        return res.status(400).json({
          error: "Campurile 'titlul' si 'startTime' sunt necesare!",
          expectedFormat: {
            title: "StringTitle",
            description: "stringDescription",
            startTime: "YYYY-MM-DDT00:00:00",
            endTime: "YYYY-MM-DDT00:00:00",
            location: "stringLocation",
          },
        });
      }
      if (!req.user?.id) {
        return res.status(401).json({ error: "User neautentificat!" });
      }

      //daca din req.body se stipuleaza data, seteaza ora implicita
      if (/^\d{4}-\d{2}-\d{2}$/.test(startTime)) {
        startTime = `${startTime}T10:00:00Z`;
      }
      // seteaza automat +1h, daca campul endTime lipseste din req.body;
      if (!endTime) {
        const start = new Date(startTime);
        endTime = new Date(start.getTime() + 60 * 60 * 1000).toISOString();
      }

      const appointment = await Appointment.create({
        title,
        description,
        startTime,
        endTime,
        location,
        userId: req.user.id, //payload JWT pentru user logat
      });

      return res
        .status(201)
        .json({ message: "Programare creata cu succes!", appointment });
    } catch (err) {
      console.error("Erroare creare programare:", err.message);
      res.status(500).json({ error: err.message });
    }
  }

  /*--GET /api/appointment/user/:userId --*/
  static async getAppointmentsByUserId(req, res) {
    try {
      const userId = Number(req.params.userId);
      if (Number.isNaN(userId)) {
        return res.status(400).json({ error: "UserId invalid!" });
      }

      if (req.user.id !== userId) {
        return res.status(403).json({
          error: "Se pot vizualiza doar propriile programari!",
        });
      }

      const appointments = await Appointment.findAll({
        where: { userId },
        order: [["startTime", "ASC"]],
        attributes: [
          "id",
          "title",
          "description",
          "startTime",
          "endTime",
          "location",
          "status",
        ],
      });

      // Daca exista sau nu programari, returneaza lista goala
      if (!appointments || appointments.length === 0) {
        return res.status(200).json({
          message: `Nu exista programari pentru user-ul cu id: ${userId}`,
          total: 0,
          appointments: []
        });
      }
      return res.status(200).json({
        message: `Programarile pentru user-ul cu id: ${userId}`,
        total: appointments.length,
        appointments
      });
    } catch (err) {
      console.error("Eroare la citirea programarilor: ", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /*--GET /api/appointment/:id---*/
  static async getAppointmentbyId(req, res) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Appointment id invalid!" });
      }
      const appointment = await Appointment.findOne({
        where: { id, userId: req.user.id }, //numai pentru user logat se pot vedea appointments;
        include: [
          { model: User, as: "user", attributes: ["id", "fullName", "email"] },
        ],
        attributes: [
          "id",
          "title",
          "description",
          "startTime",
          "endTime",
          "location",
        ],
      });

      if (!appointment) {
        return res.status(404).json({ error: "Programare negasita!" });
      }
      return res.json(appointment);
    } catch (err) {
      console.error("Eroare la preluare appointment: ", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /*--PATCH /api/appointment/:id---*/
  static async updateAppointment(req, res) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "User id invalid! pentru actualizare" });
      }
      const { title, description } = req.body;
      const appointment = await Appointment.findOne({
        where: { id, userId: req.user.id },
      });

      if (!appointment) {
        return res.status(404).json({ error: "Programare negasia in DB!" });
      }

      if (!title && !description) {
        return res.status(400).json({
          error: "Campurile 'title' sau 'description' sunt necesare!",
          expectedFormat: {
            title: "StringTitle",
            description: "stringDescription",
            startTime: "YYYY-MM-DDT00:00:00",
            endTime: "YYYY-MM-DDT00:00:00",
            location: "stringLocation",
          },
        });
      }

      await appointment.update(req.body);
      return res.status(200).json({
        message: "Programare actualizata cu succes!",
        appointment,
      });
    } catch (err) {
      console.error("Eroare la actualizare programare: ", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /*---DELETE /api/appointment/:id---*/
  static async deleteAppointment(req, res) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Appointment id invalid" });
      }
      const appointment = await Appointment.findOne({
        where: { id, userId: req.user.id },
      });
      if (!appointment) {
        return res.status(404).json({ error: "Programare negasita!" });
      }
      await appointment.destroy();
      return res.status(200).json({
        message: "Programare stearsa cu succes!",
        deletedId: appointment.id,
      });
    } catch (err) {
      console.error("Eroare la stergere appointment: ", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default AppointmentCtrl;
