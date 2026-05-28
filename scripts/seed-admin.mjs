import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Load .env manually (works with npm run seed:admin)
const dotenv = (await import('dotenv')).default;
dotenv.config({ path: '../.env' });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Validate config
const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length > 0) {
  console.error(`❌ Variables Firebase manquantes dans .env : ${missing.join(', ')}`);
  console.error('   Assure-toi que le fichier .env existe et est rempli.');
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('❌ Usage : npm run seed:admin -- <email> <password>');
  console.error('   Ex : npm run seed:admin -- admin@example.com monMotDePasse');
  process.exit(1);
}

if (password.length < 6) {
  console.error('❌ Le mot de passe doit faire au moins 6 caractères');
  process.exit(1);
}

console.log(`🚀 Création de l'utilisateur admin : ${email}`);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

try {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  await setDoc(doc(db, 'users', uid), {
    uid,
    email,
    role: 'admin',
    displayName: email.split('@')[0],
  });

  console.log(`✅ Admin créé avec succès !`);
  console.log(`   UID   : ${uid}`);
  console.log(`   Email : ${email}`);
  console.log(`   Rôle  : admin`);
  console.log(``);
  console.log(`📝 Tu peux maintenant te connecter sur /login`);
  process.exit(0);
} catch (err) {
  if (err.code === 'auth/email-already-in-use') {
    console.error(`❌ Cet email est déjà utilisé.`);
    console.error(`   Sois connecte-toi, soit utilis un autre email.`);
  } else {
    console.error(`❌ Erreur :`, err.message || err);
  }
  process.exit(1);
}
