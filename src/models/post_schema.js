import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    caption: String,
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
    },
}, { versionKey: false, timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;