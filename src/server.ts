const express = require("express");
const mongoose = require("mongoose");
import { Request, Response } from "express";


const app = express();
const PORT = 3000;
mongoose.connect('mongodb+srv://organizei:nfameCN5lac0il4w@organizei-api.px4oxxo.mongodb.net/?retryWrites=true&w=majority&appName=organizei-api');

const User = mongoose.model('User',{ name: String, email: String, password: String });

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("API rodando com Node.js e TypeScript 🚀");
});

app.post("/", async (req: Request, res: Response) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    await user.save();
    res.send(user);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
