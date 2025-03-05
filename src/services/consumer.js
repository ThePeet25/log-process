const { consumer } = require('../config/kafka');
const esClient = require("../config/elasticsearch");

const receiveMessage = async (topic) => {
    await consumer.connect();
    await consumer.subscribe({ topic , fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            value = JSON.parse(message.value.toString())
            try {
                await esClient.index({
                    index: topic,
                    body: value
                });
                console.log("send sucess");
            } catch(err) {
                console.log("err", err);
            }
            
            console.log(value)
        }
    });
}

module.exports = receiveMessage;