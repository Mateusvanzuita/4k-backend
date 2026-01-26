// src/config/multer.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 💡 Resolve o caminho absoluto para a pasta na raiz 
    const uploadPath = path.join(process.cwd(), 'uploads', 'fotos');

    // Cria a pasta recursivamente caso ela não exista
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Usa o ID do usuário logado para nomear o arquivo 
    cb(null, `aluno-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

module.exports = multer({ storage });