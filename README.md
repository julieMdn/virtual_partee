# Virtual Partee

Ce projet est une application Next.js qui permet de gérer des réservations d'expériences virtuelles.

## Table des matières

- [Prérequis](#prérequis)
- [Configuration](#configuration)
  - [Base de données](#configuration-de-la-base-de-données)
  - [Variables d'environnement](#variables-denvironnement)
- [Installation](#installation)
- [Lancement du projet](#lancement-du-projet)
- [Tests](#tests)
  - [Tests unitaires](#tests-unitaires-jest)
  - [Tests End-to-End](#tests-end-to-end-cypress)
- [Administration](#accès-à-linterface-dadministration)
- [Structure du projet](#structure-de-la-base-de-données)
- [Fonctionnalités](#fonctionnalités-principales)
- [Documentation Next.js](#documentation-nextjs)

## Prérequis

- Node.js (version 16 ou supérieure)
- MySQL (version 8.0 ou supérieure)
- npm ou yarn

## Configuration

### Configuration de la base de données

1. Installez MySQL sur votre machine si ce n'est pas déjà fait
2. Créez une nouvelle base de données MySQL :

```bash
mysql -u root -p
CREATE DATABASE virtual_partee;
```

3. Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/virtual_partee"
NEXTAUTH_SECRET="votre_secret_ici"
STRIPE_SECRET_KEY="votre_cle_stripe"
STRIPE_PUBLIC_KEY="votre_cle_publique_stripe"
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="votre_cle_publique_stripe"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

Remplacez `USER` et `PASSWORD` par vos identifiants MySQL locaux.

### Variables d'environnement

## Installation

1. Clonez le repository
2. Installez les dépendances :

```bash
npm install
# ou
yarn install
```

3. Initialisez la base de données avec Prisma :

```bash
npx prisma generate
npx prisma db push
```

## Lancement du projet

1. Démarrez le serveur de développement :

```bash
npm run dev
# ou
yarn dev
```

2. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Tests

### Tests unitaires (Jest)

Pour lancer les tests unitaires :

```bash
npm run test
# ou
yarn test
```

Pour lancer les tests en mode watch (mise à jour automatique) :

```bash
npm run test:watch
# ou
yarn test:watch
```

### Tests End-to-End (Cypress)

Pour ouvrir l'interface Cypress et lancer les tests en mode interactif :

```bash
npm run cypress:open
# ou
yarn cypress:open
```

Pour lancer les tests Cypress en mode headless (ligne de commande) :

```bash
npm run cypress:run
# ou
yarn cypress:run
```

**Note importante** : Assurez-vous que votre serveur de développement est en cours d'exécution (`npm run dev`) avant de lancer les tests E2E.

## Accès à l'interface d'administration

L'interface d'administration est accessible à l'adresse : [http://localhost:3000/admin](http://localhost:3000/admin)

Pour pouvoir vous connecter à l'interface d'administration, vous devez au préalable :

1. Créer un utilisateur avec le rôle "admin" dans votre base de données
2. Le mot de passe doit être hashé avant d'être inséré dans la base de données

Voici un exemple de requête SQL pour créer un administrateur (remplacez les valeurs entre crochets) :

```sql
-- D'abord, hashez votre mot de passe avec bcrypt ou un autre algorithme de hachage sécurisé
INSERT INTO User (
    user_name,
    user_email,
    user_password,
    user_firstname,
    user_lastname,
    user_role
) VALUES (
    '[votre_username]',
    '[votre_email]',
    '[votre_mot_de_passe_hashe]',
    '[votre_prenom]',
    '[votre_nom]',
    'admin'
);
```

## Structure de la base de données

Le projet utilise Prisma comme ORM avec les modèles suivants :

- User : Gestion des utilisateurs
- Address : Adresses des utilisateurs
- Offer : Offres d'expériences virtuelles
- TimeSlot : Créneaux horaires disponibles
- Booking : Réservations
- Payment : Paiements
- Score : Scores des utilisateurs
- OpeningHours : Horaires d'ouverture

## Fonctionnalités principales

- Authentification utilisateur
- Gestion des réservations
- Système de paiement avec Stripe
- Interface d'administration
- Gestion des créneaux horaires

## Documentation Next.js

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
