-- CreateEnum
CREATE TYPE "GrupoMuscular" AS ENUM ('PEITO', 'COSTAS', 'PERNAS', 'OMBROS', 'BRACOS', 'ABDOMEN', 'GLUTEOS', 'PANTURRILHA', 'ANTEBRACO', 'TRAPEZIO', 'CORPO_INTEIRO');

-- CreateEnum
CREATE TYPE "TipoExercicio" AS ENUM ('FORCA', 'AEROBICO', 'MOBILIDADE', 'FLEXIBILIDADE', 'FUNCIONAL', 'CARDIO');

-- CreateEnum
CREATE TYPE "CategoriaExercicio" AS ENUM ('INICIANTE', 'INTERMEDIARIO', 'AVANCADO');

-- CreateTable
CREATE TABLE "exercicios" (
    "id" TEXT NOT NULL,
    "nomeExercicio" TEXT NOT NULL,
    "grupoMuscular" "GrupoMuscular" NOT NULL,
    "tipoExercicio" "TipoExercicio" NOT NULL,
    "categoria" "CategoriaExercicio" NOT NULL,
    "linkVideo" TEXT,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coachId" TEXT NOT NULL,

    CONSTRAINT "exercicios_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exercicios" ADD CONSTRAINT "exercicios_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
