const { producer } = require("../config/kafka");

const sendMessage = async (topic, message) => {
    await producer.connect();
    await producer.send({
        topic,
        messages: [{
            value: message
        }]
    });
    await producer.disconnect();
}

module.exports = sendMessage;