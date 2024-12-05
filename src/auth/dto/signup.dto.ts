import {IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MinLength} from "class-validator";

export class SignupDto{
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, {message: 'Please enter a valid email'})
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    readonly password: string;

    @IsOptional()
    readonly role: string[];
}
