import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class ForgotPasswordV1Dto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
