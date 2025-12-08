import sequelize from "./database.js";
import { User, Appointment } from "./model/index.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

(async () => {
  try {
    //trunchiaza si reseteaza contorul la PK
    await sequelize.query("PRAGMA foreign_keys = ON;");
    await sequelize.sync({ force: true });
    await sequelize.query("DELETE FROM sqlite_sequence;");

    console.log("DB a fost sincronizata cu succes!");

    const salts = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash("parola", salts);
    //Generare User fake
    const users = [];
    for (let i = 0; i < 10; i++) {
      const user = await User.create({
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashPassword,
        googleAccessToken: null,
        googleRefreshToken: null,
        googleTokenExpire: null,
      });
      users.push(user);
      console.log(`User generat: ${user.fullName}`);
    }
    //Generare Appointment fake
    for (const user of users) {
      const startTime = faker.date.soon();
      const endTime = faker.date.soon({ days: 1, refDate: startTime });

      const appointment = await Appointment.create({
        title: faker.company.catchPhrase(),
        description: faker.company.catchPhrase(),
        startTime,
        endTime,
        userId: user.id,
        location: faker.location.streetAddress(),
      });
      console.log(
        `Programare generata: ${appointment.title} pentru user: ${user.fullName}`
      );
    }

    //Afiseaza un random User din lista de programari.
    const randomUser = users[3];
    const userAppointments = await User.findByPk(randomUser.id, {
      include: { model: Appointment, as: "appointments" },
    });
    console.log("User programat: ", JSON.stringify(userAppointments, null, 2));

    await sequelize.close();
    console.log("Deconectare de la DB!");
  } catch (error) {
    console.error("Eroare la sincronizarea bazei de date:", error);
  }
})();
