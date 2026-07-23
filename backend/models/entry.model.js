import mongoose from 'mongoose';;

const FileSchema = new mongoose.Schema({
    name: { type: String, required: true },

    type: {
        type: String,
        enum: ['file', 'folder'],
        required: true
    },

    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        default: null
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // file-only fields
    mimeType: String,
    path: String,
    telegramFileId: {
        type: String,
        // unique: true,
        sparse: true
    },
    size: Number,
    downloadURL: String,
    thumbnailUrl: String

}, { timestamps: true });

FileSchema.index(
    { name: 1, parent: 1, owner: 1 },
    { unique: true }
);

export const File = mongoose.model('File', FileSchema);