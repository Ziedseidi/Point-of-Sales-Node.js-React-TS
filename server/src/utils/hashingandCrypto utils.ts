import bcrypt from 'bcryptjs'

const saltRounds = 10;
export const hashPassword = async(password: string): Promise<string> =>{
    return await bcrypt.hash(password, saltRounds);
};
export const comparePassword = async(password: string, hashPassword:string):Promise<boolean> =>{
    return await bcrypt.compare(password,hashPassword);
};