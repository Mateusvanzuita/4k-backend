-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMININO');

-- CreateEnum
CREATE TYPE "TipoPlano" AS ENUM ('DIETA', 'TREINO', 'FULL');

-- CreateEnum
CREATE TYPE "DuracaoPlano" AS ENUM ('MENSAL', 'TRIMESTRAL');

-- CreateEnum
CREATE TYPE "FrequenciaFotos" AS ENUM ('SEMANAL', 'QUINZENAL', 'MENSAL');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "altura" DOUBLE PRECISION,
ADD COLUMN     "dataNascimento" TIMESTAMP(3),
ADD COLUMN     "duracaoPlano" "DuracaoPlano",
ADD COLUMN     "frequenciaFotos" "FrequenciaFotos",
ADD COLUMN     "historicoMedico" TEXT,
ADD COLUMN     "idade" INTEGER,
ADD COLUMN     "nomeAluno" TEXT,
ADD COLUMN     "objetivo" TEXT,
ADD COLUMN     "peso" DOUBLE PRECISION,
ADD COLUMN     "sexo" "Sexo",
ADD COLUMN     "tipoPlano" "TipoPlano";
