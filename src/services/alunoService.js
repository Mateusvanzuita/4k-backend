const studentRepository = require("../repositories/alunoRepository")
const notificationService = require("./notificationService")
const bcrypt = require("bcryptjs")

class StudentService {
  async createStudent(studentData) {
    if (studentData.dataNascimento) {
      const dateStr = studentData.dataNascimento
      const fullDateStr = dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00.000Z`

      const birthDate = new Date(fullDateStr)
      const today = new Date()

      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      studentData.idade = age
      studentData.dataNascimento = birthDate
    }

    // ===== Criar hash da senha =====
    if (studentData.senha) {
      studentData.senha = await bcrypt.hash(studentData.senha, 10)
    }

    // ===== Ajustar nome =====
    studentData.nomeCompleto = studentData.nomeAluno

    const student = await studentRepository.create(studentData);

    if (student) {
        // Envia notificação de boas-vindas
        // 💡 isStudent: true garante que o receiverAlunoId seja preenchido no BD
        await notificationService.createNotification({
            title: "Bem-vindo ao Time! 🚀",
            message: `Seu perfil foi criado. Ficou definido que você enviará fotos de evolução com frequência ${student.frequenciaFotos}. Vamos pra cima!`,
            receiverId: student.id,
            isStudent: true 
        }, null).catch(err => {
            // Logamos o erro mas não interrompemos o retorno do aluno criado
            console.error("⚠️ Falha ao enviar notificação de boas-vindas:", err.message);
        });
    }

    return student;
  }

  async getStudents(filters, pagination) {
    return await studentRepository.findMany(filters, pagination)
  }

  async getStudentById(id, coachId) {
    return await studentRepository.findById(id, coachId)
  }

  async updateStudent(id, updateData, coachId) {
    if (updateData.dataNascimento) {
      const dateStr = updateData.dataNascimento
      const fullDateStr = dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00.000Z`

      const birthDate = new Date(fullDateStr)
      const today = new Date()

      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      updateData.idade = age
      updateData.dataNascimento = birthDate
    }

    if (updateData.senha) {
      updateData.senha = await bcrypt.hash(updateData.senha, 10)
    }

    if (updateData.nomeAluno) {
      updateData.nomeCompleto = updateData.nomeAluno
    }

    return await studentRepository.update(id, updateData, coachId)
  }

  async deleteStudent(id, coachId) {
    return await studentRepository.delete(id, coachId)
  }

  async getStudentProfile(userId) {
      const perfil = await studentRepository.findProfileByUserId(userId);
      if (!perfil) {
        throw new Error("Perfil do aluno não encontrado");
      }
      return perfil;
    }
}

module.exports = new StudentService()