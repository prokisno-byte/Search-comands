// Вставь сюда конфиг своего проекта из Firebase Console:
// Project settings → General → "Your apps" → Web app → SDK setup and configuration
//
// Инструкция по получению этих значений — в README.md

const firebaseConfig = {
  apiKey: "ВСТАВЬ_СЮДА",
  authDomain: "ВСТАВЬ_СЮДА.firebaseapp.com",
  projectId: "ВСТАВЬ_СЮДА",
  storageBucket: "ВСТАВЬ_СЮДА.appspot.com",
  messagingSenderId: "ВСТАВЬ_СЮДА",
  appId: "ВСТАВЬ_СЮДА"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
