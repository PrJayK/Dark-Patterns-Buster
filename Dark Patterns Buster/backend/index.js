const express = require('express');
const { scraperUtil } = require('./scraper2.0/index.js');
const cors = require('cors');

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(cors());

app.post('/url', async (req, res) => {
    const url = req.body.url;
    await scraperUtil(url);
    res.send();
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});