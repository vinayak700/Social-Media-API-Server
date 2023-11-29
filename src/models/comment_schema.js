import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    content: {
        type: String,
        required: true,
    }
}, { versionKey: false });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;