import { JwtService } from "@nestjs/jwt";
import config from "@src/common/config";

export function generateToken(payload: any, jwtService: JwtService): string {
    return jwtService.sign(
        payload,
        { secret: config("app.secret_key") },
    );
}