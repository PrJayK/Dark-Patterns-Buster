const express = require('express');
const app = express();

const PORT = 3000;

app.post('/', () => {
    
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});