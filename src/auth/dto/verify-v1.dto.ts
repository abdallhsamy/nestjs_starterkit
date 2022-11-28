import { IsNotEmpty, IsString } from "class-validator";

export class VerifyV1Dto {
    @IsString()
    @IsNotEmpty()
    token: string;
}
