import dotenv from 'dotenv';
const isTestEnv = process.env.NODE_ENV === "test" || !!process.env.JEST_WORKER_ID;
dotenv.config({ quiet: isTestEnv });

//Application level constant and config
export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5050;
// IF POrt is not defined in .env use 5050 as deafulat
export const MONGODB_URI: string =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/default_db';
    //if MONGODB-UTI is not defined in .env, use local.backup mongodb as default

export const JWT_SECRET: string =
    process.env.JWT_SECRET || 'secret_key';