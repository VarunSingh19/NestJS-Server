import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { loginDto, RegisterDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }
    async registerUser(registerUserDto: RegisterDto) {
        console.log("Registered DTO : ", registerUserDto)

        const hash = await bcrypt.hash(registerUserDto.password, 10)
        // logic for the register
        // 1. Check if the email already exist
        // 2. hash the pass
        // 3. store the user in the db
        // 4. generate the jwt token
        // 5. send token back to the client
        const user = await this.userService.createUser({
            ...registerUserDto,
            password: hash
        });

        const payload = {
            sub: user._id,
            fname: user.fname,
            lname: user.lname,
            email: user.email
        }
        const token = await this.jwtService.signAsync(payload);
        return { access_token: token };
    }

    async loginUser(loginUserDto: loginDto) {
        const { email, password } = loginUserDto;
        // check if user exists
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        // compare pass
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        // generate jwt 
        const payload = {
            sub: user._id,
            fname: user.fname,
            lname: user.lname,
            email: user.email
        }

        // return token
        const token = await this.jwtService.signAsync(payload);
        return { access_token: token };

    }

    


    async userProfile(token: string) {
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            // Remove "Bearer " prefix if present
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
            }

            // Verify the JWT
            const decoded = this.jwtService.verify(token);

            // decoded.sub contains the user ID
            const user = await this.userService.findById(decoded.sub);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            // Return user details without password
            const { password, ...result } = user.toObject();
            return result;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

}
