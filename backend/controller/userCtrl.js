import User from "../model/User.js";
import bcrypt from "bcrypt";

class UserController {
  /*---GET  /users/:id----*/
  static async getUserId(req, res) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "User id invalid!" });
      }
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        return res.status(404).json({
          message: `User id: ${id} inexistent.`,
        });
      }
      return res.status(200).json(user);
    } catch (err) {
      console.error("Eroare la citire id: ", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  /*--POST /api/users/---*/
  static async addUser(req, res) {
    try {
      const { fullName, password, email } = req.body;
      if (!fullName || !password || !email) {
        return res.status(400).json({
          message: "Toate campurile sunt necesare!",
          expectedFormat: {
            fullName: "String Name",
            password: "***********",
            email: "stringName@exampleMail.com",
          },
        });
      }
      const foundUser = await User.findOne({ where: { email } });
      if (foundUser) {
        return res
          .status(409)
          .json({ message: "Adresa de email este deja inregistrata!" });
      }
      const salts = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash(password, salts);
      const newUser = await User.create({
        fullName,
        password: hashed,
        email,
      });
      return res.status(201).json({
        message: "User implementat cu succes!",
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
        },
      });
    } catch (err) {
      console.error("Erroare la implementare user nou.");
      res.status(500).json({ error: "Internal Error Server" });
    }
  }

  /*----PATCH /api/users/:id---*/
  static async updateUser(req, res) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "User id invalid! la request update date user." });
      }

      const { fullName, password } = req.body;
      if (!fullName && !password) {
        return res.status(400).json({
          message: "Campuri necesare pentru actualizare!",
          expectedFormat: {
            fullName: "String Name",
            password: "*********",
          },
        });
      }
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: `UserId: ${id} nu exista.` });
      }
      if (fullName) {
        user.fullName = fullName;
      }
      if (password) {
        const hash = await bcrypt.hash(password, 12);
        user.password = hash;
      }
      await user.save();
      return res.status(200).json({
        message: `UserId: ${id} a fost actualizat cu succes!`,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Erroare la actualizare user! ", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /*---DELETE /users/:id---*/
  static async deleteUser(req, res) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "User id invalid!" });
      }
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: `UserId: ${id} nu exista.` });
      }
      await user.destroy();
      return res.status(200).json({ message: `UserId: ${id} a fost sters.` });
    } catch (err) {
      console.error("Eroare la stergerea user-ului: ", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default UserController;
