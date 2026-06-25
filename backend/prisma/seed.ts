import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Nettoyage + réinitialisation des compteurs d'ID (auto-increment).
  // TRUNCATE ... RESTART IDENTITY garantit que les ids repartent de 1
  // à chaque exécution du seed (rejouable sans décaler les ids).
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "shooting_videaste", "shooting", "materiel", "client", "videaste" RESTART IDENTITY CASCADE;`
  );

  // --- 5 vidéastes ---
  // 3 actifs avec matériel perso
  const alice = await prisma.videaste.create({
    data: {
      nom: "Bernard",
      prenom: "Alice",
      email: "alice.bernard@kyn.fr",
      telephone: "06 12 34 56 78",
      statut: "actif",
      taux_horaire: 65,
      materiel_entreprise: false,
      materiels: {
        create: [
          { categorie: "caméra", nom: "Sony A7S III" },
          { categorie: "drone", nom: "DJI Mavic 3" },
          { categorie: "trépied", nom: "Manfrotto 055" },
        ],
      },
    },
  });

  const marc = await prisma.videaste.create({
    data: {
      nom: "Dubois",
      prenom: "Marc",
      email: "marc.dubois@kyn.fr",
      telephone: "06 23 45 67 89",
      statut: "actif",
      taux_horaire: 70,
      materiel_entreprise: false,
      materiels: {
        create: [
          { categorie: "caméra", nom: "Canon EOS R5" },
          { categorie: "stabilisateur", nom: "DJI RS 3 Pro" },
          { categorie: "audio", nom: "Rode Wireless GO II" },
        ],
      },
    },
  });

  const sophie = await prisma.videaste.create({
    data: {
      nom: "Lefevre",
      prenom: "Sophie",
      email: "sophie.lefevre@kyn.fr",
      telephone: "06 34 56 78 90",
      statut: "actif",
      taux_horaire: 60,
      materiel_entreprise: false,
      materiels: {
        create: [
          { categorie: "caméra", nom: "Panasonic GH6" },
          { categorie: "éclairage", nom: "Aputure 120D II" },
        ],
      },
    },
  });

  // 2 inactifs avec matériel entreprise
  const julien = await prisma.videaste.create({
    data: {
      nom: "Martin",
      prenom: "Julien",
      email: "julien.martin@kyn.fr",
      telephone: "06 45 67 89 01",
      statut: "inactif",
      taux_horaire: 55,
      materiel_entreprise: true,
    },
  });

  const camille = await prisma.videaste.create({
    data: {
      nom: "Petit",
      prenom: "Camille",
      email: "camille.petit@kyn.fr",
      telephone: "06 56 78 90 12",
      statut: "inactif",
      taux_horaire: 50,
      materiel_entreprise: true,
    },
  });

  // --- 3 clients ---
  const studio = await prisma.client.create({ data: { nom: "Studio Lumière" } });
  const horizon = await prisma.client.create({ data: { nom: "Agence Horizon" } });
  const boutique = await prisma.client.create({ data: { nom: "Boutique Évasion" } });

  // --- 10 shootings (dates passées et futures, statuts variés) ---
  // Référence : aujourd'hui = 2026-06-25
  const shootingsData = [
    { nom: "Spot pub printemps", client_id: studio.id, lieu: "Paris 11e", date: "2026-03-12", duree: 240, statut: "terminé", taux_horaire_client: 120 },
    { nom: "Interview CEO", client_id: horizon.id, lieu: "Lyon Part-Dieu", date: "2026-04-03", duree: 180, statut: "terminé", taux_horaire_client: 110 },
    { nom: "Clip corporate", client_id: studio.id, lieu: "Boulogne", date: "2026-05-20", duree: 300, statut: "terminé", taux_horaire_client: 130 },
    { nom: "Aftermovie événement", client_id: boutique.id, lieu: "Marseille Vieux-Port", date: "2026-06-10", duree: 360, statut: "terminé", taux_horaire_client: 125 },
    { nom: "Tournage produit", client_id: horizon.id, lieu: "Nantes Centre", date: "2026-06-24", duree: 120, statut: "en cours", taux_horaire_client: 100 },
    { nom: "Reportage atelier", client_id: studio.id, lieu: "Lille Wazemmes", date: "2026-06-26", duree: 240, statut: "planifié", taux_horaire_client: 115 },
    { nom: "Captation conférence", client_id: horizon.id, lieu: "Paris La Défense", date: "2026-07-08", duree: 480, statut: "planifié", taux_horaire_client: 140 },
    { nom: "Vidéo lancement", client_id: boutique.id, lieu: "Bordeaux Bastide", date: "2026-07-15", duree: 300, statut: "planifié", taux_horaire_client: 135 },
    { nom: "Shooting mode automne", client_id: boutique.id, lieu: "Cannes Croisette", date: "2026-09-02", duree: 420, statut: "planifié", taux_horaire_client: 150 },
    { nom: "Teaser annulé", client_id: studio.id, lieu: "Toulouse Capitole", date: "2026-05-05", duree: 0, statut: "annulé", taux_horaire_client: 0 },
  ];

  const shootings = [];
  for (const s of shootingsData) {
    const created = await prisma.shooting.create({
      data: {
        nom: s.nom,
        lieu: s.lieu,
        date: new Date(s.date),
        duree: s.duree,
        statut: s.statut,
        taux_horaire_client: s.taux_horaire_client,
        client: { connect: { id: s.client_id } },
      },
    });
    shootings.push(created);
  }

  // --- Relations shooting_videaste ---
  // Chaque shooting a au moins 1 vidéaste, certains en ont 2.
  // Camille (inactif) n'a aucun shooting -> permet de tester l'état "Aucun shooting".
  const links: { shooting: number; videaste: number; taux: number }[] = [
    { shooting: shootings[0].id, videaste: alice.id, taux: 65 },
    { shooting: shootings[0].id, videaste: marc.id, taux: 70 }, // 2 vidéastes
    { shooting: shootings[1].id, videaste: marc.id, taux: 70 },
    { shooting: shootings[2].id, videaste: sophie.id, taux: 60 },
    { shooting: shootings[2].id, videaste: alice.id, taux: 65 }, // 2 vidéastes
    { shooting: shootings[3].id, videaste: julien.id, taux: 55 },
    { shooting: shootings[4].id, videaste: alice.id, taux: 65 },
    { shooting: shootings[5].id, videaste: marc.id, taux: 70 },
    { shooting: shootings[5].id, videaste: sophie.id, taux: 60 }, // 2 vidéastes
    { shooting: shootings[6].id, videaste: sophie.id, taux: 60 },
    { shooting: shootings[7].id, videaste: alice.id, taux: 65 },
    { shooting: shootings[8].id, videaste: julien.id, taux: 55 },
    { shooting: shootings[9].id, videaste: marc.id, taux: 70 },
  ];

  for (const l of links) {
    await prisma.shootingVideaste.create({
      data: {
        shooting_id: l.shooting,
        videaste_id: l.videaste,
        taux_horaire_videaste: l.taux,
      },
    });
  }

  console.log("Seed terminé :");
  console.log("  - 5 vidéastes (3 actifs, 2 inactifs)");
  console.log("  - 3 clients");
  console.log("  - 10 shootings");
  console.log(`  - ${links.length} relations shooting_videaste`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
