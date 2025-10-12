import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DB_CONN_STRING!);
export const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db),
});