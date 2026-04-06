import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class SendMessageDto {
  @ApiProperty({ example: "What is GPT-4 best used for?" })
  @IsString()
  @MinLength(1)
  message!: string;

  @ApiPropertyOptional({ example: "gpt-4" })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: "You are a helpful AI assistant." })
  @IsOptional()
  @IsString()
  context?: string;
}

export class ChatMessageResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: "GPT-4 excels at complex reasoning, coding, and long-form analysis." })
  reply!: string;

  @ApiProperty({ example: "2024-01-01T12:00:00.000Z" })
  timestamp!: string;
}

export class ChatHistoryItemDto {
  @ApiProperty({ enum: ["user", "assistant"] })
  role!: "user" | "assistant";

  @ApiProperty()
  content!: string;

  @ApiProperty()
  timestamp!: string;
}
