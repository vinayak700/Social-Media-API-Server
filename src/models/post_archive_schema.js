import mongoose from 'mongoose';

const archiveSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    caption: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    bookMarked: {
        type: Boolean,
        required: true,
        default: false,
    },
    isDraft: {
        type: Boolean,
        required: true,
        default: false,
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: Number,
        default: 0,
    }
}, { versionKey: false });

const Archive = mongoose.model('Archive', archiveSchema);
export default Archive;