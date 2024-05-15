import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';


// Router
import router from './router';


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
  console.log('Server running on http://localhost:8080/')
})

// MongoDB Setup
const MONGO_URL = 'mongodb+srv://jm:jm2024@cluster0.nlu97nj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error Connecting Jibreel', (error: Error) => console.log(error))


// Routes
app.use('/', router());
