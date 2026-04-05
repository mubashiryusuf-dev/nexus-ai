import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class ResearchFeedQueryDto {
  @ApiPropertyOptional({ example: "reasoning" })
  @IsOptional()
  @IsString()
  topic?: string;
}

export class CreateDigestSubscriptionDto {
  @ApiProperty({ example: "user@nexusai.app" })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: "weekly" })
  @IsOptional()
  @IsString()
  frequency?: string;
}

export class UpdateLocalizationDto {
  @ApiProperty({ example: "ur" })
  @IsString()
  languageCode!: string;
}
