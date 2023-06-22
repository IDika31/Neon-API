import { Schema, model, } from 'mongoose';

const ApiKeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export default model('ApiKey', ApiKeySchema);