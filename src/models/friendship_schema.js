import mongoose from 'mongoose';

const friendshipSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    friend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
        required: true,
    }
}, { versionKey: false, timestamps: true });

const Friendship = mongoose.model('Friendship', friendshipSchema);
export default Friendship;