import User from "./User.js";
import Appointment from "./Appointment.js";

/*---Relatii ORM---*/
User.hasMany(Appointment, {
  foreignKey: "userId",
  as: "appointments",
  onDelete: "CASCADE",
});
Appointment.belongsTo(User, { foreignKey: "userId", as: "user" });

export { User, Appointment };

//url: http://localhost:4500/api/google/callback
