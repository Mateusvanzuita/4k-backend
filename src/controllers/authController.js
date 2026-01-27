const authService = require("../services/authService")

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body, req.user)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

// src/controllers/authController.js

const getProfile = async (req, res, next) => {
  try {
    // 💡 Se o middleware passou, o req.user já está pronto e validado
    console.log("📡 Enviando perfil para o frontend:", req.user.email);
    res.json(req.user);
  } catch (error) {
    console.error("❌ Erro no getProfile Controller:", error);
    next(error);
  }
};

// const forgotPassword = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     // Chama o serviço para processar a lógica
//     await authService.forgotPassword(email);
    
//     res.json({ 
//       success: true, 
//       message: "Se o e-mail estiver cadastrado, um link de recuperação será enviado." 
//     });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  register,
  login,
  getProfile,
  // forgotPassword,
}
