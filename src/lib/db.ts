import { channel } from "diagnostics_channel";
import mongoose, { connection } from "mongoose";

const MongoDB_URI = process.env.MONGODB_URI!

if(!MongoDB_URI){
    throw new Error("mongo db uri is missing");
}

let cached = global.mongoose 

if(!cached){
    global.mongoose = {
    conn:null,
    promise:null,
};
}

export async function conntodb() {
    if(cached.conn){
        return cached.conn
    }  
    if(!cached.promise){
        const opt ={
            bufferCommands:true,
            maxPoolSize:10
        }
        mongoose.connect(MongoDB_URI,opt).then(()=> mongoose.connection)
    }

    try {
       cached.conn = await cached.promise
    } catch (error) {
        cached.promise=null
        throw error
    }

    return cached.conn
} 