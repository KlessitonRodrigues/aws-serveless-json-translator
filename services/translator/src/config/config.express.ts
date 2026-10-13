import './config.dotenv'; // sort-imports-ignore

import { translateJsonService } from '../aws/lambda/translate/translate.service';
import { expressToLambdaEvent } from '../utils/utils.express';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const localRoutes = () => {
  const router = express.Router();

  router.post('/translate/json', expressToLambdaEvent(translateJsonService));
  return router;
};

const localApi = async () => {
  const app = express();
  const routes = localRoutes();
  const port = 3005;

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(
    cors({
      credentials: true,
      origin: (_: any, callback: any) => callback(null, true),
    }),
  );
  app.use(routes);
  app.listen(port, () => console.log('Running at: http://localhost:' + port));
};

localApi();
