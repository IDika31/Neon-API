import { Schema, model, Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import paginate from 'mongoose-paginate-v2';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    createdAt: Date;
    modifiedAt: Date;
}

const UserSchema = new Schema(
    {
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
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        modifiedAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        timestamps: true,
    }
);

// UserSchema.plugin(paginate);
// UserSchema.plugin(unique);

UserSchema.pre('save', async function (next) {
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

export default model<IUser>('User', UserSchema);
