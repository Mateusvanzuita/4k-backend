-- CreateEnum
CREATE TYPE "TipoHormonio" AS ENUM ('PEPTIDEO', 'ESTEROIDE', 'TIREOIDE', 'CRESCIMENTO', 'INSULINA', 'CORTISOL', 'TESTOSTERONA', 'OUTRO');

-- CreateEnum
CREATE TYPE "CategoriaHormonio" AS ENUM ('GH_RELEASING', 'INSULINA_LIKE', 'PEPTIDEO_TERAPEUTICO', 'ANABOLICO', 'ANDROGENICO', 'CORTICOSTEROIDE', 'T3', 'T4', 'TSH', 'SOMATOTROPINA', 'IGF', 'RAPIDA', 'LENTA', 'INTERMEDIARIA', 'MODULADOR_HORMONAL', 'OUTRO');

-- CreateEnum
CREATE TYPE "FrequenciaHormonio" AS ENUM ('DIARIA', 'DIA_SIM_DIA_NAO', 'DUAS_VEZES_SEMANA', 'SEMANAL', 'QUINZENAL', 'MENSAL', 'CONFORME_NECESSARIO');

-- CreateEnum
CREATE TYPE "ViaAdministracao" AS ENUM ('SUBCUTANEA', 'INTRAMUSCULAR', 'ORAL', 'TOPICA', 'NASAL', 'INTRAVENOSA');

-- CreateEnum
CREATE TYPE "DuracaoUso" AS ENUM ('DUAS_SEMANAS', 'QUATRO_SEMANAS', 'SEIS_SEMANAS', 'OITO_SEMANAS', 'DOZE_SEMANAS', 'DEZESSEIS_SEMANAS', 'VINTE_SEMANAS', 'CONTINUO');

-- CreateTable
CREATE TABLE "hormonios" (
    "id" TEXT NOT NULL,
    "nomeHormonio" TEXT NOT NULL,
    "tipo" "TipoHormonio" NOT NULL,
    "categoria" "CategoriaHormonio" NOT NULL,
    "dosagem" TEXT NOT NULL,
    "frequencia" "FrequenciaHormonio" NOT NULL,
    "viaAdministracao" "ViaAdministracao" NOT NULL,
    "duracaoUso" "DuracaoUso" NOT NULL,
    "observacoes" TEXT,
    "contraindicacoes" TEXT,
    "efeitosColaterais" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coachId" TEXT NOT NULL,

    CONSTRAINT "hormonios_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "hormonios" ADD CONSTRAINT "hormonios_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
