import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/SignInDto';
import { RegisterDto } from './dtos/RegisterDto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(200)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.email, signInDto.password);
    }


    @HttpCode(201)
    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }


    @HttpCode(200)
    @Get('profile')
    @UseGuards(AuthGuard)
    profile(@Request() req: any) {
        return req.user;
    }
}
