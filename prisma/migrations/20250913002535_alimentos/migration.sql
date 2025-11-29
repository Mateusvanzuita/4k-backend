-- CreateEnum
CREATE TYPE "CategoriaAlimento" AS ENUM ('PROTEINA', 'CARBOIDRATO', 'GORDURA', 'FRUTA', 'VEGETAL', 'LATICINIO', 'OUTRO');

-- CreateEnum
CREATE TYPE "UnidadeAlimento" AS ENUM ('GRAMAS', 'MILILITROS', 'UNIDADE', 'COLHER', 'XICARA', 'PORCAO');

-- CreateTable
CREATE TABLE "alimentos" (
    "id" TEXT NOT NULL,
    "nomeAlimento" TEXT NOT NULL,
    "categoria" "CategoriaAlimento" NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "unidade" "UnidadeAlimento" NOT NULL,
    "calorias" DOUBLE PRECISION NOT NULL,
    "proteinas" DOUBLE PRECISION NOT NULL,
    "carboidratos" DOUBLE PRECISION NOT NULL,
    "gorduras" DOUBLE PRECISION NOT NULL,
    "fibras" DOUBLE PRECISION,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coachId" TEXT NOT NULL,

    CONSTRAINT "alimentos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "alimentos" ADD CONSTRAINT "alimentos_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
