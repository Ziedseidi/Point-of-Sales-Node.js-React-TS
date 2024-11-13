import { Types } from "mongoose";

export interface IUser {
    userName: string;
    email: string; // Adding email field
    password: string;
    dateOfBirth: Date;
    phone: number;
    refreshToken: string;
    confirmationCode: string;
    profileImage?: string;
    isActive: boolean;
    role: Types.ObjectId | null;
    isDisabled: boolean;
    resetPasswordToken: string; // Adding resetPasswordToken field
    resetPasswordExpires: Date | null; // Adding resetPasswordExpires field
}
