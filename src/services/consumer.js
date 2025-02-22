const { consumer } = require('../config/kafka');

const receiveMessage = async (topic) => {
    await consumer.connect();
    await consumer.subscribe({ topic , fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
              value: message.value.toString(),
            })
        }
    });
}

module.exports = receiveMessage;