-- AlterEnum
BEGIN;
CREATE TYPE "StatutShooting_new" AS ENUM ('script', 'planifie', 'tournage', 'montage', 'revision', 'termine');
ALTER TABLE "public"."Shooting" ALTER COLUMN "statut" DROP DEFAULT;
ALTER TABLE "Shooting" ALTER COLUMN "statut" TYPE "StatutShooting_new" USING ("statut"::text::"StatutShooting_new");
ALTER TYPE "StatutShooting" RENAME TO "StatutShooting_old";
ALTER TYPE "StatutShooting_new" RENAME TO "StatutShooting";
DROP TYPE "public"."StatutShooting_old";
ALTER TABLE "Shooting" ALTER COLUMN "statut" SET DEFAULT 'script';
COMMIT;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "site_web" TEXT;

-- AlterTable
ALTER TABLE "Shooting" ADD COLUMN     "is_paused" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "statut_avant_pause" "StatutShooting",
ALTER COLUMN "statut" SET DEFAULT 'script';

