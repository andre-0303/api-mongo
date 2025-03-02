import express, { json } from "express";
import mongoose from "mongoose";

import User from "./models/User.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Rota raiz
app.get("/", (req, res) => {
  return res.json({ message: "Bem-vindo à API!" });
});

// Rota GET para listar usuários (exemplo básico)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); //buscar todos os usuários
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

// Rota POST para criar um novo usuário
app.post("/users", async (req, res) => {
  try {
    const user = req.body;
    const newUser = await User.create(user);
    return res.json(newUser);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar usuário." });
  }
});

// Rota para deletar um usuário pelo nickName
app.delete("/users/:nickName", async (req, res) => {
  const { nickName } = req.params; // Pega o nickName da URL

  try {
    // Deleta o usuário com o nickName fornecido
    const deletedUser = await User.findOneAndDelete({ nickName });

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.json({
      message: `Usuário com o nickName "${nickName}" deletado com sucesso.`,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar o usuário." });
  }
});

app.put("/users/:nickName", async (req, res) => {
    const { nickName } = req.params; // Pega o nickName da URL
    const updates = req.body; // Pega os dados a serem atualizados no corpo da requisição
    
    try {
      // Atualiza o usuário com o nickName fornecido
      const updatedUser = await User.findOneAndUpdate({ nickName }, updates, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }
  
      return res.json({ message: "Usuário atualizado com sucesso!", updatedUser });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar o usuário." });
    }
  });

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Conecta ao MongoDB
mongoose
  .connect(
    "mongodb+srv://andre:23042024Ma@api.vydc0.mongodb.net/?retryWrites=true&w=majority&appName=API"
  )
  .then(() => {
    console.log("Conexão com o banco de dados bem sucedida!");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
  });
