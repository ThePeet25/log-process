const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
    node: process.env.ELASTICSEARCH_HOST || "http://localhost:9200"
});

const elasticCreate = async (topic) => {
    const exists = await esClient.indices.exists({ index: topic });
    if (!exists) {
        await esClient.indices.create({ 
            index: topic ,
            mappings: {
                properties: {
                    emai: {
                        type : "text"
                    },
                    event : {
                        type: "text"
                    },
                    provider: {
                        type: "text"
                    },
                    timestamp: {
                        type: "keyword"
                    },
                    user_id: {
                        type: "text"
                    },
                }
            }
        });
    }
}

elasticCreate("auht-log");
module.exports = esClient;