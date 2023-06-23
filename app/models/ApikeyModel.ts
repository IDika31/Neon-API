import { Schema, model } from 'mongoose';
import timestamp from 'mongoose-timestamp';

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
    }
});

ApiKeySchema.plugin(timestamp);

export default model('ApiKey', ApiKeySchema);
