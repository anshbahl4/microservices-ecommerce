const express = require('express');
const app = express();

const PORT = process.env.PORT || 3002;

app.get('/', (req, res) => {
    res.send('Product Service is running!');
});

app.listen(PORT, () => {
    console.log(`Product Service listening on port ${PORT}`);
});
