import { Types } from 'mongoose';

export interface IRole {
    name: string;
    description: string;
    modulePermissions: {
        module: string;
        permissions: string[];
    }[];
}
