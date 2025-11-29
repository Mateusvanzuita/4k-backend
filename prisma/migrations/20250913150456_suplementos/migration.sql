-- CreateEnum
CREATE TYPE "TipoSuplemento" AS ENUM ('SUPLEMENTO', 'MANIPULADO');

-- CreateEnum
CREATE TYPE "CategoriaSuplemento" AS ENUM ('TERMOGENICO', 'PRE_TREINO', 'HORMONAL', 'ANTIOXIDANTE', 'DIGESTIVO', 'SONO', 'VITAMINA', 'MINERAL', 'PROTEINA', 'CREATINA', 'BCAA', 'OUTRO');

-- CreateEnum
CREATE TYPE "MomentoSuplemento" AS ENUM ('PRE_TREINO', 'POS_TREINO', 'MANHA', 'TARDE', 'NOITE', 'JEJUM', 'REFEICAO');

-- CreateTable
CREATE TABLE "suplementos" (
    "id" TEXT NOT NULL,
    "nomeSuplemento" TEXT,
    "nomeManipulado" TEXT,
    "tipo" "TipoSuplemento" NOT NULL,
    "categoria" "CategoriaSuplemento" NOT NULL,
    "dosagem" TEXT NOT NULL,
    "frequencia" TEXT NOT NULL,
    "momento" "MomentoSuplemento" NOT NULL,
    "observacoes" TEXT,
    "contraindicacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coachId" TEXT NOT NULL,

    CONSTRAINT "suplementos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "suplementos" ADD CONSTRAINT "suplementos_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
