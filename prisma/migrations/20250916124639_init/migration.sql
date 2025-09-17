-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "public"."ActionType" AS ENUM ('AJOUT', 'MODIFICATION');

-- CreateEnum
CREATE TYPE "public"."PropositionStatus" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE');

-- CreateTable
CREATE TABLE "public"."Utilisateur" (
    "id" SERIAL NOT NULL,
    "pseudo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Generation" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Type" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pokemon" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "photo" TEXT,
    "description" TEXT,
    "generationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Commentaire" (
    "id" SERIAL NOT NULL,
    "texte" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auteurId" INTEGER NOT NULL,
    "pokemonId" INTEGER NOT NULL,

    CONSTRAINT "Commentaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Proposition" (
    "id" SERIAL NOT NULL,
    "contenu" JSONB NOT NULL,
    "typeAction" "public"."ActionType" NOT NULL,
    "statut" "public"."PropositionStatus" NOT NULL DEFAULT 'EN_ATTENTE',
    "dateProposee" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auteurId" INTEGER NOT NULL,
    "pokemonId" INTEGER NOT NULL,

    CONSTRAINT "Proposition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_PokemonToType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PokemonToType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_pseudo_key" ON "public"."Utilisateur"("pseudo");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "public"."Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Generation_nom_key" ON "public"."Generation"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Type_nom_key" ON "public"."Type"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_nom_key" ON "public"."Pokemon"("nom");

-- CreateIndex
CREATE INDEX "Pokemon_generationId_idx" ON "public"."Pokemon"("generationId");

-- CreateIndex
CREATE INDEX "Commentaire_auteurId_idx" ON "public"."Commentaire"("auteurId");

-- CreateIndex
CREATE INDEX "Commentaire_pokemonId_idx" ON "public"."Commentaire"("pokemonId");

-- CreateIndex
CREATE INDEX "Proposition_auteurId_idx" ON "public"."Proposition"("auteurId");

-- CreateIndex
CREATE INDEX "Proposition_pokemonId_idx" ON "public"."Proposition"("pokemonId");

-- CreateIndex
CREATE INDEX "Proposition_statut_idx" ON "public"."Proposition"("statut");

-- CreateIndex
CREATE INDEX "_PokemonToType_B_index" ON "public"."_PokemonToType"("B");

-- AddForeignKey
ALTER TABLE "public"."Pokemon" ADD CONSTRAINT "Pokemon_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "public"."Generation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Commentaire" ADD CONSTRAINT "Commentaire_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "public"."Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Commentaire" ADD CONSTRAINT "Commentaire_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "public"."Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Proposition" ADD CONSTRAINT "Proposition_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "public"."Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Proposition" ADD CONSTRAINT "Proposition_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "public"."Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PokemonToType" ADD CONSTRAINT "_PokemonToType_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PokemonToType" ADD CONSTRAINT "_PokemonToType_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
