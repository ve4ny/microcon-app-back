import express from 'express';
import bodyParser from 'body-parser';

import router from './settings/routes.js';

const PORT = 5000;
const app = express();

console.log(`Server started on port ${PORT}`);

app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router(app);

app.listen(PORT);
