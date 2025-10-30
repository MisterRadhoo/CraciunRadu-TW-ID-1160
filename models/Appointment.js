import { DataTypes, Model } from "sequelize";
import User from "./User.js";
import sequelize from "../database.js";

export class Appointment extends Model {}

Appointment.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    date: { type: DataTypes.DATE, allowNull: false },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    location: { type: DataTypes.STRING, allowNull: true },
    googleCalendarEventId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("scheduled", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "scheduled",
    },
  },

  {
    sequelize,
    modelName: "Appointment",
    tableName: "appointments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

/*---Relatii ORM---*/
User.hasMany(Appointment, { foreignKey: "userId", onDelete: "CASCADE" });
Appointment.belongsTo(User, { foreignKey: "userId" });

export default Appointment;
