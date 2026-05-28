# New Jersey 🏀

Interface de présentation de maillots de basket avec système de prix collaboratif.

## Stack

- **React 19** + **TypeScript**
- **Vite** (build)
- **Tailwind CSS v4** + **Shadcn/ui**
- **Firebase** (Auth, Firestore, Storage)
- **React Router DOM**

## Pages

| Route | Description | Accès |
|-------|-------------|-------|
| `/` | Galerie de maillots (grille responsive) | Public |
| `/jersey/:id` | Détail d'un maillot + proposer un prix | Membres connectés |
| `/login` | Connexion / inscription | Anonymes |
| `/admin` | Dashboard admin (CRUD maillots) | Admin uniquement |
| `/admin/edit/:id` | Modifier un maillot | Admin uniquement |

## Configuration Firebase

### 1. Créer un projet Firebase

1. Va sur [console.firebase.google.com](https://console.firebase.google.com/)
2. Crée un nouveau projet (ou utilise un existant)
3. Active ces services :

### 2. Authentication

- **Authentication → Sign-in method**
- Activer **Email/Password**
- Activer **Google** (configure le consentement OAuth)

### 3. Firestore Database

- **Firestore Database → Créer une base de données**
- Mode test ou production (tu peux commencer en mode test)
- Créer un **index composite** pour la galerie :
  - Collection : `jerseys`
  - Champs : `createdAt` (descendant)
  - Sinon les requêtes échoueront

### 4. Storage

- **Storage → Démarrer**
- Règles de sécurité (à adapter) :
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /jerseys/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Récupérer les identifiants

- **Project settings → Général → Apps Web**
- Copie les variables dans le fichier `.env` (voir `.env.example`)

### 6. Créer un utilisateur admin

Utilise le script de seed ou fais-le manuellement :

**Via la console Firestore :**
1. Crée un document dans `users/{uid_de_l_utilisateur}`
2. Champs : `{ uid: "...", email: "...", role: "admin", displayName: "..." }`

**Via le script de seed** (recommandé) :
```bash
cd scripts
node seed-admin.mjs <email> <password>
```

## Installation

```bash
# Cloner
git clone https://github.com/ejwebstudio-bit/new-jersey.git
cd new-jersey

# Copier et remplir le .env
cp .env.example .env
# Éditer .env avec tes identifiants Firebase

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build production
npm run build
```

## Utilisation

1. **Inscris-toi** via `/login`
2. **Demande le rôle admin** à un admin existant ou via la console Firestore
3. Une fois admin, va dans `/admin` → **Nouveau** pour ajouter des maillots
4. Les photos uploadées vont dans Firebase Storage
5. Les membres connectés peuvent proposer leur prix sur chaque maillot

## Collection Firestore

```
jerseys/{jerseyId}
  ├── name: string          (ex: "Cavaliers City Edition")
  ├── team: string          (ex: "Cleveland Cavaliers")
  ├── type: string          (ex: "City Edition", "Classic", etc.)
  ├── price: number         (prix indicatif)
  ├── description: string
  ├── photos: string[]      (URLs Firebase Storage)
  ├── createdBy: string     (uid admin)
  └── createdAt: timestamp

userPrices/{userId}_{jerseyId}
  ├── userId: string
  ├── jerseyId: string
  ├── price: number
  └── updatedAt: timestamp

users/{uid}
  ├── email: string
  ├── role: "admin" | "member"
  └── displayName: string
```

## Structure du projet

```
src/
├── components/
│   ├── ui/           # Shadcn/ui components
│   ├── Navbar.tsx
│   ├── JerseyCard.tsx
│   └── PhotoUploader.tsx
├── pages/
│   ├── Gallery.tsx
│   ├── JerseyDetail.tsx
│   ├── Login.tsx
│   └── Admin.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useJerseys.ts
├── lib/
│   ├── firebase.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```
