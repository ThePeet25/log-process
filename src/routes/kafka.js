const express = require('express');
const { verifyAccestoken, checkRoles } = require('../config/auth.js');
const esClient = require('../config/elasticsearch.js');

const router = express.Router();


router.get('/all-log', verifyAccestoken, checkRoles("Admin"), async (req, res) =>{
    try {
        const result = await esClient.search({
            index: "auth-log",
            size: 100,
            query: {
                match_all : {}
            },
            sort: [{
                "timestamp.keyword" : {
                    order: "desc"
                }
            }]
        });
        const data = result.hits.hits.map(data => data._source);
        const searchQuery = req.query.email || '';
        const filterData = data.filter(item => item.email.includes(searchQuery));
    res.render('log', {
        isAuthenticated:  req.isAuthenticated(),
        role: req.isAuthenticated() ? req.user['https://dev.com/claims/roles'] : 0 ,
        data: filterData,
        searchQuery
    })
    } catch(err) {
        console.log(err);
        res.json({
            message: "error can't search",
            error: err
        });
    }
});

module.exports = router