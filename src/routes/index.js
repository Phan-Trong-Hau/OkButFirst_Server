import AuthRouter from './Auth.js';

function route(app) {
    app.use("/api/auth", AuthRouter);

    // app.use("/", LoginRouter);
}

export default route;
