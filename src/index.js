import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { connectDb } from "./db/connectDb.js";
import { app } from "./app.js";

const port = process.env.PORT || 8001;

(async () => {
    try {
        await connectDb(process.env.PG_URI);

        app.on("error", (error) => {
            console.log("ERROR: ", error);
        });

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error("PG DB Connection Failed!", err.message);
        process.exit(1);
    }
})();
