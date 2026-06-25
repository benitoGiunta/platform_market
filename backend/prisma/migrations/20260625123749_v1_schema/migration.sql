-- CreateEnum
CREATE TYPE "StatutVideaste" AS ENUM ('actif', 'inactif');

-- CreateEnum
CREATE TYPE "StatutShooting" AS ENUM ('planifie', 'en_cours', 'termine', 'annule');

-- CreateEnum
CREATE TYPE "CategorieMateriel" AS ENUM ('camera', 'drone', 'trepied', 'stabilisateur', 'eclairage', 'audio', 'autre', 'entreprise');

-- CreateEnum
CREATE TYPE "DomainMetier" AS ENUM ('Retail', 'Horeca', 'Industrie', 'Services');

-- CreateTable
CREATE TABLE "Videaste" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "statut" "StatutVideaste" NOT NULL DEFAULT 'actif',
    "taux_horaire" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Videaste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materiel" (
    "id" SERIAL NOT NULL,
    "categorie" "CategorieMateriel" NOT NULL,
    "nom" TEXT NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Materiel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterielVideaste" (
    "id" SERIAL NOT NULL,
    "materiel_id" INTEGER NOT NULL,
    "videaste_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaterielVideaste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "nom_legal" TEXT,
    "adresse" TEXT,
    "numero_tva" TEXT,
    "domaine_metier" "DomainMetier",
    "date_creation" TIMESTAMP(3),
    "email" TEXT,
    "telephone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shooting" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER,
    "nom" TEXT NOT NULL,
    "lieu" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "duree" INTEGER NOT NULL,
    "statut" "StatutShooting" NOT NULL DEFAULT 'planifie',
    "taux_horaire_client" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shooting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShootingVideaste" (
    "id" SERIAL NOT NULL,
    "shooting_id" INTEGER NOT NULL,
    "videaste_id" INTEGER NOT NULL,
    "taux_horaire_videaste" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShootingVideaste_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Videaste_statut_idx" ON "Videaste"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "Materiel_nom_is_system_key" ON "Materiel"("nom", "is_system");

-- CreateIndex
CREATE INDEX "MaterielVideaste_videaste_id_idx" ON "MaterielVideaste"("videaste_id");

-- CreateIndex
CREATE INDEX "MaterielVideaste_materiel_id_idx" ON "MaterielVideaste"("materiel_id");

-- CreateIndex
CREATE UNIQUE INDEX "MaterielVideaste_materiel_id_videaste_id_key" ON "MaterielVideaste"("materiel_id", "videaste_id");

-- CreateIndex
CREATE INDEX "Shooting_date_idx" ON "Shooting"("date");

-- CreateIndex
CREATE INDEX "Shooting_statut_idx" ON "Shooting"("statut");

-- CreateIndex
CREATE INDEX "Shooting_client_id_idx" ON "Shooting"("client_id");

-- CreateIndex
CREATE INDEX "ShootingVideaste_shooting_id_idx" ON "ShootingVideaste"("shooting_id");

-- CreateIndex
CREATE INDEX "ShootingVideaste_videaste_id_idx" ON "ShootingVideaste"("videaste_id");

-- CreateIndex
CREATE UNIQUE INDEX "ShootingVideaste_shooting_id_videaste_id_key" ON "ShootingVideaste"("shooting_id", "videaste_id");

-- AddForeignKey
ALTER TABLE "MaterielVideaste" ADD CONSTRAINT "MaterielVideaste_materiel_id_fkey" FOREIGN KEY ("materiel_id") REFERENCES "Materiel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterielVideaste" ADD CONSTRAINT "MaterielVideaste_videaste_id_fkey" FOREIGN KEY ("videaste_id") REFERENCES "Videaste"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shooting" ADD CONSTRAINT "Shooting_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShootingVideaste" ADD CONSTRAINT "ShootingVideaste_shooting_id_fkey" FOREIGN KEY ("shooting_id") REFERENCES "Shooting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShootingVideaste" ADD CONSTRAINT "ShootingVideaste_videaste_id_fkey" FOREIGN KEY ("videaste_id") REFERENCES "Videaste"("id") ON DELETE CASCADE ON UPDATE CASCADE;
