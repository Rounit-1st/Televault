import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
    {
        originalName: {
            type: String,
            required: true
        },
        mimeType: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        telegramFileId: {
            type: String,
            required: true,
            unique: true
        },
        telegramFilePath: {
            type: String,
            required: true
        },
        downloadUrl: {
            type: String,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
);

const File = mongoose.model('File', FileSchema);

export { File };

// const Folder = mongoose.model('Folder', FolderSchema) //remember the product name should start with captital letter and must be singular so mongo internall does convert objects into products
// const File = mongoose.model('File', FileSchema)

// export {Folder,File};