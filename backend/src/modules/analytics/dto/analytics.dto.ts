import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UsageQueryDto {
  @ApiPropertyOptional({ example: "7d" })
  @IsOptional()
  @IsString()
  window?: string;

  @ApiPropertyOptional({ example: "gpt-5" })
  @IsOptional()
  @IsString()
  modelSlug?: string;
}
