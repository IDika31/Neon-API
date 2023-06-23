import { Schema, model, Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import timestamp from 'mongoose-timestamp';
import unique from 'mongoose-unique-validator';

// export interface UserDocument extends Document {
//     username: string;
//     email: string;
//     password: string;
// }

// export type UserDocument = User;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
});

UserSchema.plugin(timestamp);
UserSchema.plugin(unique);

UserSchema.pre('save', async function(next) {
    try {
        // Hanya enkripsi password jika sudah diubah atau baru ditambahkan.
        if (!this.isModified('password')) {
            return next();
        }

        // Generate salt dengan tingkat keamanan 10.
        const salt = await bcrypt.genSalt(10);
        // Hash password menggunakan salt yang dihasilkan.
        const hashedPassword = await bcrypt.hash(this.password, salt);
        // Timpa password asli dengan yang dienkripsi.
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

export default model('User', UserSchema);
