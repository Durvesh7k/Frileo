// app.js
import 'dotenv/config'; // instead of require('dotenv').config();
import express from 'express';
import cors from 'cors';
import Router from './routes/routes.js';
import webhookRouter from './routes/webhook.js'

const app = express();
const PORT = process.env.PORT || 5000; // Make sure PORT is defined

app.use(cors());
app.use('/webhook', webhookRouter)

app.use(express.json());
app.use('/', Router);
app.get('/', (req, res) => {
    res.send('Fiverr Clone API is running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
