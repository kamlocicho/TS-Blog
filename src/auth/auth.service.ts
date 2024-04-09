import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/RegisterDto';


@Injectable()
export class AuthService {
    constructor(private usersService: UserService, private jwtService: JwtService) {}

    async signIn(email: string, password: string): Promise<{access_token: string}> {
        const user = await this.usersService.findOne(email);

        if (!user || !await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const {password: _, ...result} = user;
        return {
            access_token: await this.jwtService.signAsync(result)
        }
    }


    async register(registerDto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        return this.usersService.create({
            ...registerDto,
            password: hashedPassword
        });
    }
}
