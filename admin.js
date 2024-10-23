var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json'); // Asegúrate de que esta ruta es correcta

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };
