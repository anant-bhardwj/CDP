import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import generateToken from "../utils/generateToken.js";
import { createDatasetForUser } from "../utils/createDatasetForUser.js";

const prisma = new PrismaClient();

export const signup = async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const { username, email, password, confirmPassword } = req.body;

    //Check if username already exists
    const checkUser = await prisma.user.findUnique({ where: { username } });
    if (checkUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    //Check if email  already exists
    const checkEmail = await prisma.user.findUnique({ where: { email } });
    if (checkEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    //HASH  PASSWORD BEFORE SAVING
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: { username, email, passwordHash },
    });

    //generate token
    if (user) {
      generateToken(user.id, res);
    }

    const datasetResult = await createDatasetForUser(user.id);

    if (!datasetResult.success) {
      return res.status(400).json({ message: datasetResult.message });
    }

    //done. user created
    console.log("User created and dataset created");
    res.status(201).json({ message: "User created", username: user.username });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).send({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash || ""))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    generateToken(user.id, res);

    console.log("Login successful");

    res
      .status(200)
      .json({ message: "Login successful", username: user.username });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).send({ message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    console.log("Logout successful");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
