import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

import chalk from 'chalk';

// Router
import router from './router';
// DB
import connectDb from './config/db';

const app = express();

app.use(cors({
  credentials: true,
}));

app.use(compression());
app.use(cookieParser());
// Postman API Post GET
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log(chalk.blue('Server running on http://localhost:8080/'))
})

// Connect DB
connectDb()

// Routes
app.use('/', router());
