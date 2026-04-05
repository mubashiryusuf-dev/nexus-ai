import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateAgentDto {
  @ApiProperty({ example: "Research Copilot" })
  @IsString()
  name!: string;

  @ApiProperty({ example: "Research agent" })
  @IsString()
  template!: string;

  @ApiProperty({ example: "Use GPT-5 for source analysis and summaries." })
  @IsString()
  instructions!: string;

  @ApiProperty({ type: [String], example: ["search", "documents", "email"] })
  @IsArray()
  tools!: string[];
}

export class UpdateAgentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  tools?: string[];
}
