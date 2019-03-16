const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET
router.get('/', async (req, res) => {
    res.status(200).send();
});

module.exports = router;