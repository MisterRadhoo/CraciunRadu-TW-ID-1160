import { DataTypes, Model } from "sequelize";
import sequelize from "../database.js";
//import bcrypt from "bcrypt";

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    googleAccessToken: { type: DataTypes.STRING, allowNull: true },
    googleRefreshToken: { type: DataTypes.STRING, allowNull: true },
    googleTokenExpire: { type: DataTypes.BIGINT, allowNull: true },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// // Hook -> pentru criptare a campului 'password', inainte de implementare user nou;
// User.beforeCreate(async (user) => {
//   user.password = await bcrypt.hash(user.password, 10);
// });

export default User;
