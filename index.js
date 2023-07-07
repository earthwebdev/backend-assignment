import express from 'express';
import 'dotenv/config';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';
import helmet from "helmet";
import morgan from 'morgan';

import rateLimit from 'express-rate-limit';

import indexRouter from './routes/index.router.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//securit for the parameters security
app.use(mongoSanitize());
//security for the http parameter polutions
app.use(hpp());
//cors for cross site script execution
app.use(cors());

// Use Helmet for header security
app.use(helmet());
//for the logs datas
app.use(morgan('combined'));

const apiRequestLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // limit each IP to 20 requests per windowMs
    handler: function (req, res, /*next*/) {
        return res.status(429).json({
          error: 'You sent too many requests. Please wait a while then try again'
        })
    }
})

// Use the limit rule as an application middleware
app.use(apiRequestLimiter)

app.use("/api/v1", indexRouter);

const SERVER_PORT = process.env.SERVER_PORT || 8080;

app.listen(SERVER_PORT, (err) => {
    if (err) console.log(err);
    console.log(`Server is running on port ${SERVER_PORT}`);
})