const { Kafka } = require('kafkajs');

const kafka = new Kafka ({
    clientId: "my-app",
    brokers: ['localhost:9092', 'localhost:9093'],
    connectionTimeout: 10000,
     requestTimeout: 25000,
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' });

module.exports = { producer, consumer };