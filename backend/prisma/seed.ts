import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ----------------------------------------------------------------------------
// Reset — vide toutes les tables et remet les séquences d'ID à zéro.
// Noms de tables = noms des models Prisma (pas de @@map) -> PascalCase.
// ----------------------------------------------------------------------------
export async function resetDatabase() {
  await prisma.$executeRawUnsafe(
    `TRUNCATE "Videaste", "Materiel", "MaterielVideaste", "Client", "Shooting", "ShootingVideaste" RESTART IDENTITY CASCADE;`,
  );
}

// ----------------------------------------------------------------------------
// Seed — idempotent. Reset d'abord (séquences propres + relançable sans erreur),
// puis insertion du dataset de test (toujours le même).
// ----------------------------------------------------------------------------
export async function seedDatabase() {
  await resetDatabase();

  // --- Matériel système (protégé, is_system) — via upsert (idempotent) ---
  const systeme = await prisma.materiel.upsert({
    where: { nom_is_system: { nom: "Matériel entreprise", is_system: true } },
    update: {},
    create: {
      categorie: "entreprise",
      nom: "Matériel entreprise",
      is_system: true,
    },
  });

  // --- Matériels perso ---
  const materielsData = [
    { categorie: "camera" as const, nom: "Sony A7S III" },
    { categorie: "drone" as const, nom: "DJI Mavic 3" },
    { categorie: "trepied" as const, nom: "Manfrotto 055" },
    { categorie: "camera" as const, nom: "Canon EOS R5" },
    { categorie: "stabilisateur" as const, nom: "DJI RS 3 Pro" },
    { categorie: "audio" as const, nom: "Rode Wireless GO II" },
    { categorie: "eclairage" as const, nom: "Aputure 120D II" },
  ];
  const materiels: Record<string, number> = {};
  for (const m of materielsData) {
    const created = await prisma.materiel.create({ data: m });
    materiels[m.nom] = created.id;
  }

  // --- Vidéastes ---
  const videastesData = [
    {
      nom: "Bernard",
      prenom: "Alice",
      email: "alice.bernard@kyn.fr",
      telephone: "06 12 34 56 78",
      statut: "actif" as const,
      taux_horaire: 65,
    },
    {
      nom: "Dubois",
      prenom: "Marc",
      email: "marc.dubois@kyn.fr",
      telephone: "06 23 45 67 89",
      statut: "actif" as const,
      taux_horaire: 70,
    },
    {
      nom: "Lefevre",
      prenom: "Sophie",
      email: "sophie.lefevre@kyn.fr",
      telephone: "06 34 56 78 90",
      statut: "actif" as const,
      taux_horaire: 60,
    },
    {
      nom: "Martin",
      prenom: "Julien",
      email: "julien.martin@kyn.fr",
      telephone: "06 45 67 89 01",
      statut: "inactif" as const,
      taux_horaire: 55,
    },
    {
      nom: "Petit",
      prenom: "Camille",
      email: "camille.petit@kyn.fr",
      telephone: "06 56 78 90 12",
      statut: "inactif" as const,
      taux_horaire: 50,
    },
  ];
  const videastes: Record<string, number> = {};
  for (const v of videastesData) {
    const created = await prisma.videaste.create({ data: v });
    videastes[v.prenom] = created.id;
  }

  // --- Clients ---
  const clientsData = [
    {
      nom: "Studio Lumière",
      nom_legal: "Studio Lumière SARL",
      adresse: "12 rue des Arts, 75011 Paris",
      numero_tva: "FR12345678901",
      domaine_metier: "Retail" as const,
      date_creation: new Date("2021-04-15"),
      email: "contact@studiolumiere.fr",
      telephone: "01 23 45 67 89",
    },
    {
      nom: "Agence Horizon",
      nom_legal: "Horizon Communication SAS",
      adresse: "5 quai de la Loire, 44000 Nantes",
      numero_tva: "FR98765432109",
      domaine_metier: "Horeca" as const,
      date_creation: new Date("2019-09-01"),
      email: "hello@agencehorizon.fr",
      telephone: "02 40 11 22 33",
    },
    {
      nom: "Boutique Évasion",
      nom_legal: "Évasion Retail SARL",
      adresse: "30 Croisette, 06400 Cannes",
      numero_tva: "FR55512378456",
      domaine_metier: "Services" as const,
      date_creation: new Date("2022-01-20"),
      email: "info@boutique-evasion.fr",
      telephone: "04 93 99 88 77",
    },
  ];
  const clients: Record<string, number> = {};
  for (const c of clientsData) {
    const created = await prisma.client.create({ data: c });
    clients[c.nom] = created.id;
  }

  // --- Shootings (statuts enum, dates passées et futures, réf. aujourd'hui = 2026-06-25) ---
  const shootingsData = [
    {
      nom: "Spot pub printemps",
      client: "Studio Lumière",
      lieu: "Paris 11e",
      date: "2026-03-12",
      duree: 240,
      statut: "termine" as const,
      taux_horaire_client: 120,
    },
    {
      nom: "Interview CEO",
      client: "Agence Horizon",
      lieu: "Lyon Part-Dieu",
      date: "2026-04-03",
      duree: 180,
      statut: "termine" as const,
      taux_horaire_client: 110,
    },
    {
      nom: "Clip corporate",
      client: "Studio Lumière",
      lieu: "Boulogne",
      date: "2026-05-20",
      duree: 300,
      statut: "termine" as const,
      taux_horaire_client: 130,
    },
    {
      nom: "Aftermovie événement",
      client: "Boutique Évasion",
      lieu: "Marseille Vieux-Port",
      date: "2026-06-10",
      duree: 360,
      statut: "termine" as const,
      taux_horaire_client: 125,
    },
    {
      nom: "Tournage produit",
      client: "Agence Horizon",
      lieu: "Nantes Centre",
      date: "2026-06-24",
      duree: 120,
      statut: "en_cours" as const,
      taux_horaire_client: 100,
    },
    {
      nom: "Reportage atelier",
      client: "Studio Lumière",
      lieu: "Lille Wazemmes",
      date: "2026-06-26",
      duree: 240,
      statut: "planifie" as const,
      taux_horaire_client: 115,
    },
    {
      nom: "Captation conférence",
      client: "Agence Horizon",
      lieu: "Paris La Défense",
      date: "2026-07-08",
      duree: 480,
      statut: "planifie" as const,
      taux_horaire_client: 140,
    },
    {
      nom: "Vidéo lancement",
      client: "Boutique Évasion",
      lieu: "Bordeaux Bastide",
      date: "2026-07-15",
      duree: 300,
      statut: "planifie" as const,
      taux_horaire_client: 135,
    },
    {
      nom: "Shooting mode automne",
      client: "Boutique Évasion",
      lieu: "Cannes Croisette",
      date: "2026-09-02",
      duree: 420,
      statut: "planifie" as const,
      taux_horaire_client: 150,
    },
    {
      nom: "Teaser annulé",
      client: "Studio Lumière",
      lieu: "Toulouse Capitole",
      date: "2026-05-05",
      duree: 0,
      statut: "annule" as const,
      taux_horaire_client: 0,
    },
  ];
  const shootings: number[] = [];
  for (const s of shootingsData) {
    const created = await prisma.shooting.create({
      data: {
        nom: s.nom,
        lieu: s.lieu,
        date: new Date(s.date),
        duree: s.duree,
        statut: s.statut,
        taux_horaire_client: s.taux_horaire_client,
        client: { connect: { id: clients[s.client] } },
      },
    });
    shootings.push(created.id);
  }

  // --- Liaisons matériel <-> vidéaste ---
  const materielLinks = [
    { videaste: "Alice", materiel: materiels["Sony A7S III"] },
    { videaste: "Alice", materiel: materiels["DJI Mavic 3"] },
    { videaste: "Alice", materiel: materiels["Manfrotto 055"] },
    { videaste: "Marc", materiel: materiels["Canon EOS R5"] },
    { videaste: "Marc", materiel: materiels["DJI RS 3 Pro"] },
    { videaste: "Marc", materiel: materiels["Rode Wireless GO II"] },
    { videaste: "Sophie", materiel: materiels["Aputure 120D II"] },
    { videaste: "Sophie", materiel: materiels["Canon EOS R5"] },
    { videaste: "Julien", materiel: systeme.id },
    { videaste: "Camille", materiel: systeme.id },
  ];
  for (const l of materielLinks) {
    await prisma.materielVideaste.create({
      data: { materiel_id: l.materiel, videaste_id: videastes[l.videaste] },
    });
  }

  // --- Liaisons shooting <-> vidéaste (taux horaire vidéaste) ---
  // Camille n'a aucun shooting -> teste l'état "Aucun shooting".
  const shootingLinks = [
    { shooting: 0, videaste: "Alice", taux: 65 },
    { shooting: 0, videaste: "Marc", taux: 70 },
    { shooting: 1, videaste: "Marc", taux: 70 },
    { shooting: 2, videaste: "Sophie", taux: 60 },
    { shooting: 2, videaste: "Alice", taux: 65 },
    { shooting: 3, videaste: "Julien", taux: 55 },
    { shooting: 4, videaste: "Alice", taux: 65 },
    { shooting: 5, videaste: "Marc", taux: 70 },
    { shooting: 5, videaste: "Sophie", taux: 60 },
    { shooting: 6, videaste: "Sophie", taux: 60 },
    { shooting: 7, videaste: "Alice", taux: 65 },
    { shooting: 8, videaste: "Julien", taux: 55 },
    { shooting: 9, videaste: "Marc", taux: 70 },
  ];
  for (const l of shootingLinks) {
    await prisma.shootingVideaste.create({
      data: {
        shooting_id: shootings[l.shooting],
        videaste_id: videastes[l.videaste],
        taux_horaire_videaste: l.taux,
      },
    });
  }

  return {
    materiels: materielsData.length + 1,
    videastes: videastesData.length,
    clients: clientsData.length,
    shootings: shootingsData.length,
    materielLinks: materielLinks.length,
    shootingLinks: shootingLinks.length,
  };
}

async function main() {
  const counts = await seedDatabase();
  console.log("Seed V1 terminé :");
  console.log(`  - ${counts.materiels} matériels (dont 1 système "Matériel entreprise")`);
  console.log(`  - ${counts.videastes} vidéastes`);
  console.log(`  - ${counts.clients} clients`);
  console.log(`  - ${counts.shootings} shootings`);
  console.log(`  - ${counts.materielLinks} liaisons matériel/vidéaste`);
  console.log(`  - ${counts.shootingLinks} liaisons shooting/vidéaste`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
