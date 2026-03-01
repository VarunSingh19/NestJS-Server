import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto{

    @IsString()
    @IsNotEmpty()
    fname:string;

    @IsString()
    @IsNotEmpty()
    lname:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsAlphanumeric()
    @IsNotEmpty()
    password:string;
}

export class loginDto{
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    password:string;
}