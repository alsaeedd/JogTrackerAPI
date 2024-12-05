import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User} from "./schemas/user.schema";
import * as bcrypt from 'bcryptjs';
import {JwtService} from "@nestjs/jwt";
import {Model} from "mongoose";
import {SignupDto} from "./dto/signup.dto";
import {LoginDto} from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) {}

    async signup(signupDto: SignupDto): Promise<{user: User , token: string}> {
        const { name, email, password, role } = signupDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        const emailExists = await this.userModel.findOne({email});
        if(emailExists){
            throw new UnauthorizedException('Email already exists');
        }

        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword,
            role
        });



        const token = this.jwtService.sign({ id: user._id });
        return { user, token};
    }

    async login(loginDto: LoginDto): Promise<{user:User, token: string}> {
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email });

        if(!user){
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if(!isPasswordMatched){
            throw new UnauthorizedException('Invalid email or password');
        }

        const token = this.jwtService.sign({ id: user._id });
        return {user, token};
    }
}
