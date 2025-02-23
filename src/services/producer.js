const { json } = require("sequelize");
const { producer } = require("../config/kafka");

const sendMessage = async (topic, message) => {
    await producer.connect();
    await producer.send({
        topic,
        messages: [{
            value: JSON.stringify(message)
        }]
    });
    console.log("send success topic :", topic);
    await producer.disconnect();
}

module.exports = sendMessage;