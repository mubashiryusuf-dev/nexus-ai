import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class CatalogQueryDto {
  @ApiPropertyOptional({ example: "language" })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: "OpenAI" })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ example: "subscription" })
  @IsOptional()
  @IsString()
  pricingModel?: string;

  @ApiPropertyOptional({ example: 4.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({ example: "apache-2.0" })
  @IsOptional()
  @IsString()
  license?: string;
}

export class CreateModelReviewDto {
  @ApiProperty({ example: "reviewer-001" })
  @IsString()
  userRef!: string;

  @ApiProperty({ example: 4.8 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiProperty({ example: "Great for research and tool use." })
  @IsString()
  comment!: string;
}

export class CompareModelsDto {
  @ApiProperty({ type: [String], example: ["gpt-5", "claude-3-7", "gemini-2-5"] })
  @IsArray()
  modelSlugs!: string[];
}
