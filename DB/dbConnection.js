import mongoose from "mongoose";

export const dbConnection = async () => {
    return await mongoose.connect(process.env.URL_HOST).then(() => {
        console.log(`db connection successfully in ${process.env.URL_HOST}........ `);
    }).catch(() => {
        console.log("db connection failed ********");
    })
}