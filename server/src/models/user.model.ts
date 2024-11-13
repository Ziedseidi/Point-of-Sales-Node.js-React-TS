import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../typesAndinterfaces/IUserInterface';

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    refreshToken: {
        type: String,
        default: ''
    },
    confirmationCode: {
        type: String,
        default: '' // Modifier à default: null si cela est permis dans votre logique de validation
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isDisabled: {
         type: Boolean,
         default: false },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        default: null
    },
    resetPasswordToken: {
        type: String,
        default: ''
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    profileImage: { type: String }
});

export interface IUserDocument extends IUser, Document {}

const User = mongoose.model<IUserDocument>('User', userSchema);
export default User;

