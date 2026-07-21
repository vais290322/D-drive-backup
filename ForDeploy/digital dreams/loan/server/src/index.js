require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 7060;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.get('/', (req, res) => res.json({ ok: true, message: 'Digital Dreems API' }));

app.use('/auth', authRoutes);
const customersRoutes = require('./routes/customers');
const loansRoutes = require('./routes/loans');

app.use('/api/customers', customersRoutes);
app.use('/api/loans', loansRoutes);

async function start() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/digitaldreemsloan';
    await mongoose.connect(uri, { autoIndex: true });
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
