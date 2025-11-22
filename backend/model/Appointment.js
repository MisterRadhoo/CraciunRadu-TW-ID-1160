import { DataTypes, Model } from "sequelize";
import sequelize from "../database.js";

export class Appointment extends Model {}

Appointment.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.DATE, allowNull: false },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    location: { type: DataTypes.STRING, allowNull: true },
    googleCalendarEventId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      field: "google_calendar_event_id",
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
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Appointment;
