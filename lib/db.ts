import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DB_CONN_STRING!);
export const db = client.db();
await db.collection("profiles").createIndex({ user_id: 1 }, { unique: true });
await db.collection("resumes").createIndex({ user_id: 1, createdAt: -1 });
await db.collection("coverLetters").createIndex({ user_id: 1, createdAt: -1 });