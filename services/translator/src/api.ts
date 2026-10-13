import './config/dotenv'; // sort-imports-ignore

import * as bodyparser from 'body-parser';

import * as translateService from './aws/lambda/translate/translate.service';
import { expressToLambdaEvent } from './utils/express';

const express = require('express');
const cors = require('cors');

const app = express();
const port = 3005;

app.use(bodyparser.json({ limit: '5mb' }));
app.use(cors());
app.post('/translate', expressToLambdaEvent(translateService.translateJsonService));
app.listen(port, () => console.log('Running at: http://localhost:' + port));
