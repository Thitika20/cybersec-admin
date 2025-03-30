const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const CryptoJS = require("crypto-js");


const app = express();
const PORT = 5000;
const prisma = new PrismaClient();

app.use(express.json()); // ใช้ JSON body parser
app.use(cors());

app.post("/usr/usercreate", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const encodedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();

    const user = await prisma.user.create({
      data: { username, password: encodedPassword},
    });

    res.json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/usr/getusers", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "no Users All na", details: error.message });
  }
});

app.get("/usr/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch user", details: error.message });
  }
});

app.put("/usr/userupdate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { username, password: encodedPassword },
    });

    const encodedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();

    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("❌ Error:", error);
    res
      .status(500)
      .json({ error: "Failed to update user", details: error.message });
  }
});

app.delete("/usr/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error:", error);
    res
      .status(500)
      .json({ error: "Failed to delete user", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});