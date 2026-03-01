import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private UserModel: Model<User>) { }

    async createUser(registerUserDto: RegisterDto) {
        try {
            return await this.UserModel.create({
                fname: registerUserDto.fname,
                lname: registerUserDto.lname,
                email: registerUserDto.email,
                password: registerUserDto.password,
            });
        } catch (err: unknown) {
            const e = err as { code?: number }
            const DUPLICATE_KEY_CODE = 11000;

            if (e.code === DUPLICATE_KEY_CODE) {
                throw new ConflictException("Email is taken");
            }

            throw err;
        }
    }

    async findByEmail(email: string) {
        return this.UserModel.findOne({ email });
    }

    async findById(id: string) {
        return this.UserModel.findById(id);
    }

}
