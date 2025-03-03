import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://app.chivisclothes.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Origin'],
  exposedHeaders: ['Access-Control-Allow-Origin'],
  credentials: true
}));

// Pre-flight requests
app.options('*', cors());

// Additional headers middleware
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'https://app.chivisclothes.com'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin');
  next();
});

app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Google Sheets API setup
async function getAccessToken() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const authClient = await auth.getClient();
  return authClient.getAccessToken();
}

async function appendToSheet(values) {
  const sheets = google.sheets('v4');
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  try {
    const response = await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Respuestas!A:L',
      valueInputOption: 'RAW',
      requestBody: {
        values: [values]
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw error;
  }
}

// API endpoint for form submission
app.post('/api/submit-form', async (req, res) => {
  if (!process.env.GOOGLE_CLIENT_EMAIL) {
    return res.status(500).json({ error: 'Missing GOOGLE_CLIENT_EMAIL' });
  }
  if (!process.env.GOOGLE_PRIVATE_KEY) {
    return res.status(500).json({ error: 'Missing GOOGLE_PRIVATE_KEY' });
  }
  if (!process.env.SPREADSHEET_ID) {
    return res.status(500).json({ error: 'Missing SPREADSHEET_ID' });
  }

  try {
    const body = req.body;
    const values = [
      new Date().toISOString(),
      body.compraPreferencia || '',
      body.ciudad || '',
      body.edad || '',
      body.ocupacion || '',
      body.estilo || '',
      body.experiencia || '',
      body.recomendacion || '',
      body.sugerencia || '',
      body.aceptaTerminos ? 'Sí' : 'No'
    ];

    const result = await appendToSheet(values);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error saving data',
      details: error.message
    });
  }
});

// Serve the frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});