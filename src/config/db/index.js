import mongoose from "mongoose";
import "dotenv/config";

const urlDatabase = process.env.URL_DB;

const connect = async () => {
    try {
        await mongoose.connect(urlDatabase, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connect successfully!!");
    } catch (error) {
        console.log("Connect failure!!");
    }
};

export default connect;
