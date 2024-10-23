const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const path = require('path');

// Cargar las credenciales de la cuenta de servicio desde una variable de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/content', async (req, res) => {
  try {
    console.log('GET /content request received');
    const snapshot = await db.collection('content').get();
    let contents = [];
    snapshot.forEach(doc => {
      contents.push({ id: doc.id, ...doc.data() });
    });
    console.log('GET /content successful', contents);
    res.status(200).json(contents);
  } catch (error) {
    console.error('Error in GET /content:', error);
    res.status(500).send(error);
  }
});

app.get('/content/:id', async (req, res) => {
  try {
    console.log(`GET /content/${req.params.id} request received`);
    const doc = await db.collection('content').doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).send('No such document!');
    } else {
      res.status(200).json({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    console.error(`Error in GET /content/${req.params.id}:`, error);
    res.status(500).send(error);
  }
});

app.post('/content', async (req, res) => {
  try {
    console.log('POST /content request received', req.body);
    const newContent = req.body;
    const docRef = await db.collection('content').add(newContent);
    console.log('POST /content successful', { id: docRef.id, ...newContent });
    res.status(201).json({ id: docRef.id, ...newContent });
  } catch (error) {
    console.error('Error in POST /content:', error);
    res.status(500).send(error);
  }
});

app.put('/content/:id', async (req, res) => {
  try {
    console.log('PUT /content/:id request received', req.params.id, req.body);
    const id = req.params.id;
    const updatedContent = req.body;
    await db.collection('content').doc(id).update(updatedContent);
    console.log('PUT /content/:id successful', { id, ...updatedContent });
    res.status(200).json({ id, ...updatedContent });
  } catch (error) {
    console.error('Error in PUT /content/:id:', error);
    res.status(500).send(error);
  }
});

app.delete('/content/:id', async (req, res) => {
  try {
    console.log('DELETE /content/:id request received', req.params.id);
    const id = req.params.id;
    await db.collection('content').doc(id).delete();
    console.log('DELETE /content/:id successful', { id });
    res.status(200).json({ id });
  } catch (error) {
    console.error('Error in DELETE /content/:id:', error);
    res.status(500).send(error);
  }
});

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: SCOPES,
});

const getSheetData = async (spreadsheetId, range) => {
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return response.data.values;
};

app.get('/packinglist/:referencia', async (req, res) => {
  try {
    const { referencia } = req.params;
    const spreadsheetId = '1CNmfgb27gjQtPFM_wXtz0CWg-53c0eurdlrcyjIMB2M'; // ID de la hoja de cálculo de Google
    const range = `${referencia}!A1:F20`; // Rango de celdas a obtener
    const data = await getSheetData(spreadsheetId, range);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    res.status(500).send(error);
  }
});

module.exports = app;
