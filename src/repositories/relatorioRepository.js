const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class RelatorioRepository {
  async getDashboardStats(coachId) {
    // 1. Contagens Básicas
    const totalAlunos = await prisma.aluno.count({ where: { coachId } });
    const alunosAtivos = await prisma.aluno.count({ where: { coachId, ativo: true } });
    const protocolosCriados = await prisma.protocolo.count({ where: { coachId } });

    // 2. Distribuição por Sexo (HOMENS vs MULHERES)
    const distribuicaoSexo = await prisma.aluno.groupBy({
      by: ['sexo'],
      where: { coachId },
      _count: { id: true }
    });

    // 3. Planos mais aderidos (MENSAL, ANUAL, etc)
    const distribuicaoPlanos = await prisma.aluno.groupBy({
      by: ['plano'],
      where: { coachId },
      _count: { id: true }
    });

    // 4. Tipos de Plano (TREINO, DIETA, FULL)
    const distribuicaoTiposPlano = await prisma.aluno.groupBy({
      by: ['tipoPlano'],
      where: { coachId },
      _count: { id: true }
    });

    // 5. Objetivos (HIPERTROFIA, PERDA_PESO, etc)
    const distribuicaoObjetivos = await prisma.aluno.groupBy({
      by: ['objetivo'],
      where: { coachId },
      _count: { id: true }
    });

    // 6. Evolução Temporal (Protocolos criados por mês)
    const evolucaoTemporal = await prisma.$queryRaw`
      SELECT 
        to_char(date_trunc('month', "dataCriacao"), 'DD/MM') as data,
        count(id)::int as "quantidade"
      FROM protocolos
      WHERE "coachId" = ${coachId}
      AND "dataCriacao" >= now() - interval '6 months'
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    return {
      kpis: [
        { label: "Total de Alunos", value: totalAlunos, icon: "users" },
        { label: "Alunos Ativos", value: alunosAtivos, icon: "activity" },
        { label: "Protocolos Criados", value: protocolosCriados, icon: "file-text" }
      ],
      sexo: distribuicaoSexo.map(i => ({ name: i.sexo, value: i._count.id })),
      planos: distribuicaoPlanos.map(i => ({ name: i.plano, value: i._count.id })),
      tiposPlano: distribuicaoTiposPlano.map(i => ({ name: i.tipoPlano, value: i._count.id })),
      objetivos: distribuicaoObjetivos.map(i => ({ name: i.objetivo, value: i._count.id })),
      evolucao: evolucaoTemporal
    };
  }
}

module.exports = new RelatorioRepository();