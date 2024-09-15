import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import routes from './src/routes/routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use("", routes);

// Listen on port 3000
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
