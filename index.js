import path from "path";
import cors from "cors";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import "dotenv/config";

import route from "./src/routes/index.js";
import dataConnect from "./src/config/db/index.js";

const app = express();
const PORT = 8080;
const urlDatabase = process.env.URL_DB;
const urlClient = process.env.URL_FONTEND;
const keySecret = process.env.KEY_SECRET;

// set allow cors for fe
app.use(
    cors({
        origin: [urlClient],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// config cookie parser
app.use(cookieParser());

// config body parser
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({limit: '50mb'}));

// session connect
app.use(
    session({
        key: "userId",
        secret: keySecret,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
        store: MongoStore.create({
            mongoUrl: urlDatabase,
        }),
    })
);

// data connection
dataConnect();

// routes init
route(app);

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
});
