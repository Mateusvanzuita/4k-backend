const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class StudentRepository {
  async create(studentData) {
    return await prisma.aluno.create({
      data: {
        nomeCompleto: studentData.nomeCompleto,
        dataNascimento: studentData.dataNascimento,
        idade: studentData.idade,
        sexo: studentData.sexo,
        altura: studentData.altura,
        peso: studentData.peso,
        email: studentData.email,
        senha: studentData.senha,
        contato: studentData.contato,
        plano: studentData.plano,
        tipoPlano: studentData.tipoPlano,
        objetivo: studentData.objetivo,
        jaTreinava: studentData.jaTreinava ?? false,
        restricaoAlimentar: studentData.restricaoAlimentar,
        restricaoExercicio: studentData.restricaoExercicio,
        historicoMedico: studentData.historicoMedico,
        frequenciaFotos: studentData.frequenciaFotos,
        observacoes: studentData.observacoes,
        coachId: studentData.coachId,
      },
      select: {
        id: true,
        nomeCompleto: true,
        dataNascimento: true,
        idade: true,
        sexo: true,
        altura: true,
        peso: true,
        email: true,
        contato: true,
        plano: true,
        tipoPlano: true,
        objetivo: true,
        jaTreinava: true,
        restricaoAlimentar: true,
        restricaoExercicio: true,
        historicoMedico: true,
        frequenciaFotos: true,
        observacoes: true,
        dataCriacao: true, // Crucial para o CronService
        coach: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async findMany(filters, pagination) {
    const { coachId, search, tipoPlano, sexo, plano } = filters
    const { page, limit } = pagination

    const where = {
      coachId,
      ...(search && {
        OR: [
          { nomeCompleto: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(tipoPlano && { tipoPlano }),
      ...(sexo && { sexo }),
      ...(plano && { plano }),
    }

    const [students, total] = await Promise.all([
      prisma.aluno.findMany({
        where,
        select: {
          id: true,
          nomeCompleto: true,
          dataNascimento: true,
          idade: true,
          sexo: true,
          altura: true,
          peso: true,
          email: true,
          contato: true,
          plano: true,
          tipoPlano: true,
          objetivo: true,
          frequenciaFotos: true,
          dataCriacao: true,
          coach: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { dataCriacao: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.aluno.count({ where }),
    ])

    return { students, total }
  }

  async findById(id, coachId) {
    return await prisma.aluno.findFirst({
      where: { id, coachId },
      select: {
        id: true,
        nomeCompleto: true,
        dataNascimento: true,
        idade: true,
        sexo: true,
        altura: true,
        peso: true,
        email: true,
        contato: true,
        plano: true,
        tipoPlano: true,
        objetivo: true,
        jaTreinava: true,
        restricaoAlimentar: true,
        restricaoExercicio: true,
        historicoMedico: true,
        frequenciaFotos: true,
        observacoes: true,
        dataCriacao: true,
        dataAtualizacao: true,
        registrosEvolucao: {
        select: {
          id: true,
          dataCriacao: true,
          peso: true,
          observacao: true,
          fotos: { // ✅ Relação definida no model RegistroEvolucao 
            select: {
              url: true // ✅ Campo da imagem no model FotoEvolucao [cite: 19]
            }
          }
        },
        orderBy: { dataCriacao: 'desc' } // Mostra as fotos mais recentes primeiro
      },
        coach: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async update(id, updateData, coachId) {
    const student = await this.findById(id, coachId)
    if (!student) return null

    return await prisma.aluno.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nomeCompleto: true,
        dataNascimento: true,
        idade: true,
        sexo: true,
        altura: true,
        peso: true,
        email: true,
        contato: true,
        plano: true,
        tipoPlano: true,
        objetivo: true,
        jaTreinava: true,
        restricaoAlimentar: true,
        restricaoExercicio: true,
        historicoMedico: true,
        frequenciaFotos: true,
        observacoes: true,
        dataAtualizacao: true,
        coach: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async delete(id, coachId) {
    const student = await this.findById(id, coachId)
    if (!student) return null

    await prisma.aluno.delete({ where: { id } })
    return true
  }

  async findProfileByUserId(userId) {
    const aluno = await prisma.aluno.findUnique({
      where: { id: userId },
      include: {
        coach: {
          select: { name: true }
        }
      }
    });

    if (!aluno) return null;

    return {
      id: aluno.id,
      nomeCompleto: aluno.nomeCompleto,
      email: aluno.email,
      idade: aluno.idade,
      plano: aluno.plano,
      tipoPlano: aluno.tipoPlano,
      objetivo: aluno.objetivo,
      dataInicio: aluno.dataCriacao, 
      avatar: null,
      coachNome: aluno.coach?.name
    };
  }

  async updateFirstAccess(id) {
    return await prisma.aluno.update({
      where: { id },
      data: { primeiroAcesso: true }
    });
  }
}

module.exports = new StudentRepository()