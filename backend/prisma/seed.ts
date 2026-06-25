import { seedDatabase } from "../src/lib/seed.js";
import { prisma } from "../src/lib/prisma.js";

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
