import {Folder, File} from "../models/entry.model";
import mongoose from "mongoose";

async function registerTheEntry(name,isFolder,path, userId){
    const timestamps = Date.now() 
    const newEntry = await Entry.create({
        name,
        isFolder,
        path,
        timestamps
    })
    
    await newEntry.save();
}