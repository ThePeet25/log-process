require('dotenv').config();
const express = require('express');
const regislog = require('./routes/auth.js');
const sequelize = require('./schema/db.js');

const PORT = process.env.PORT
const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use('/', regislog);

app.listen(PORT, async () => {
    console.log("app running on port", PORT);
    // await sequelize.sync({ force: true });
    await sequelize.sync();
})