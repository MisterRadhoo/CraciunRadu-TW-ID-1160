import sequelize from "./database.js";
import User from "./models/User.js";
import Appointment from "./models/Appointment.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";


(async()=> {
    try {
        //trunchiaza si reseteaza contorul la PK
        await sequelize.query("PRAGMA foreign_keys = ON;");
        await sequelize.sync({force: true});
        await sequelize.query("DELETE FROM sqlite_sequence;");

        console.log("Db a fost sincronizata cu succes!");


         const hashPassword = await bcrypt.hash("parola", 10);
         //Generare User fake
         const users = [];
         for(let i = 0; i < 10; i++) {
            const user =  await User.create({
                fullName: faker.person.fullName(),
                email: faker.internet.email(),
                password: hashPassword,
            });
            users.push(user);
            console.log(`User generati: ${user.fullName}`);
         }
             //Generare Appointment fake
            for(const user of users) {
                const appointment = await Appointment.create({
                    title: faker.company.catchPhrase(),
                    description: faker.company.catchPhrase(),
                    date: new Date(),
                    userId: user.id,
                });
                console.log(`Programare generata: ${appointment.title} pentru user: ${user.fullName}`);
            }
             
            //Afiseaza un random User din lista de programari.
            const randomUser = users[1];
            const userAppointmnets = await User.findByPk(randomUser.id, {
                include: Appointment,
            });
            console.log("User programat: ", JSON.stringify(userAppointmnets, null, 2));

            await sequelize.close();
            console.log("Deconectare de la DB!");

        } catch (error) {
            console.error("Eroare la sincronizarea bazei de date:", error);
        }    
})();