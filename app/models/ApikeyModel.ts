import { Schema, Document, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface IApiKey extends Document {
    key: string;
    userId: Schema.Types.ObjectId;
}

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

ApiKeySchema.plugin(paginate);

export default model<IApiKey>('ApiKey', ApiKeySchema);
