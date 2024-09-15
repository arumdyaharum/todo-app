import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

class Auth {
  async register (req, res) {
    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({
        where: {
          email: email,
        } 
      });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // generate uuid
      const userId = v4();
      const salt = 10;
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        name,
        email,
        password: hashedPassword,
      }

      User.create(newUser).then((user) => {
        return res.status(201).json({ message: 'User registered successfully', id: user.id });
      });

    } catch(err) {
      console.log("Error:", err, "===err");
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    }
  }
  async login (req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(200).json({ message: 'Login successful', token });
    } catch(err) {
      console.log("Error:", err, "===err");
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    }
  }
}

export default new Auth();