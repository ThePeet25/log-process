require('dotenv').config();
const express = require('express');
const regislog = require('./routes/auth.js');
const sequelize = require('./schema/db.js');
const sendMessage = require('./services/producer.js');

const PORT = process.env.PORT
const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use('/', regislog);

app.post('/send', async(req, res) => {
    const data = req.body
    try {
        await sendMessage(data.topic, data.message);
        console.log("success send");
        res.send("success");
    } catch(err) {
        console.log('err', err);
        res.send('cant send')
    }
})

// app.get('/receive/:topic', async(req, res) => {
//     const topic = req.params
//     try {
//         const response = await receiveMessage(topic);
//         console.log(response);
//         res.json(response);
//     } catch(err) {
//         console.log('err', err);
//         res.send("cant get message")
//     }
// })

app.listen(PORT, async () => {
    console.log("app running on port", PORT);
    // await sequelize.sync({ force: true });
    await sequelize.sync();
})