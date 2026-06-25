-- CreateTable
CREATE TABLE "videaste" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "taux_horaire" DECIMAL(65,30) NOT NULL,
    "materiel_entreprise" BOOLEAN NOT NULL,

    CONSTRAINT "videaste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materiel" (
    "id" SERIAL NOT NULL,
    "videaste_id" INTEGER NOT NULL,
    "categorie" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "materiel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shooting" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "lieu" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "duree" INTEGER NOT NULL,
    "statut" TEXT NOT NULL,
    "taux_horaire_client" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "shooting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shooting_videaste" (
    "id" SERIAL NOT NULL,
    "shooting_id" INTEGER NOT NULL,
    "videaste_id" INTEGER NOT NULL,
    "taux_horaire_videaste" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "shooting_videaste_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "materiel" ADD CONSTRAINT "materiel_videaste_id_fkey" FOREIGN KEY ("videaste_id") REFERENCES "videaste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shooting" ADD CONSTRAINT "shooting_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shooting_videaste" ADD CONSTRAINT "shooting_videaste_shooting_id_fkey" FOREIGN KEY ("shooting_id") REFERENCES "shooting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shooting_videaste" ADD CONSTRAINT "shooting_videaste_videaste_id_fkey" FOREIGN KEY ("videaste_id") REFERENCES "videaste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
