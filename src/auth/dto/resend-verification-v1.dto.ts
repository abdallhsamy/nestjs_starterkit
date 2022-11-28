import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class ResendVerificationV1Dto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
