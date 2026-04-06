import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

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

export class SocialSignInDto {
  @ApiProperty({ enum: ["Google", "GitHub", "Microsoft"], example: "Google" })
  @IsString()
  @IsIn(["Google", "GitHub", "Microsoft"])
  provider!: string;

  @ApiPropertyOptional({ example: "Jane Doe" })
  @IsOptional()
  @IsString()
  displayName?: string;
}

export class CreateGuestSessionDto {
  @ApiProperty({ example: "en", required: false })
  locale?: string;
}
