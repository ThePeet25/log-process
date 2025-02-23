const express = require('express');
const { verifyAccestoken, checkRoles } = require('../config/auth.js');
const esClient = require('../config/elasticsearch.js');

const router = express.Router();

router.get('/all-log', verifyAccestoken, checkRoles("Admin"), async (req, res) =>{
    const data = req.body;
    try {
        const result = await esClient.search({
            index: "auth-log",
            size: 50,
        })
        const data = result.hits.hits.map(data => data._source);
        res.json(data.pop());
    } catch(err) {
        console.log(err);
        res.json({
            message: "error can't search",
            error: err
        });
    }
})

module.exports = router