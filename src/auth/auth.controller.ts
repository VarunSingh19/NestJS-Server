import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto, RegisterDto } from './dto/registerUser.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('register')
    async register(@Body() registerUserDto: RegisterDto) {
        const token = await this.authService.registerUser(registerUserDto);
        return token;
    }

    @Post('login')
    async login(@Body() loginUserDto: loginDto) {
        const token = await this.authService.loginUser(loginUserDto);
        return token;
    }

    @Get('profile')
    async profile(@Headers('authorization') authHeader: string) {
        const token = authHeader?.split(' ')[1]; // remove 'Bearer ' prefix if present
        const userProfile = await this.authService.userProfile(token);
        return userProfile;
    }

}

