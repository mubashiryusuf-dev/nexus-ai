import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class SignUpDto {
  @ApiProperty({ example: "John Doe" })
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: "john@nexusai.app" })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: "StrongPass123" })
  @MinLength(8)
  password!: string;
}

export class SignInDto {
  @ApiProperty({ example: "john@nexusai.app" })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: "StrongPass123" })
  @MinLength(8)
  password!: string;
}

export class CreateGuestSessionDto {
  @ApiProperty({ example: "en", required: false })
  locale?: string;
}
