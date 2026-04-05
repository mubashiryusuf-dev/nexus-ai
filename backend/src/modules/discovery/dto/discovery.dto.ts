import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

class OnboardingAnswerDto {
  @ApiProperty({ example: "goal" })
  @IsString()
  questionKey!: string;

  @ApiProperty({ example: "Find the best models for a research assistant" })
  @IsString()
  answer!: string;
}

export class CreateOnboardingProfileDto {
  @ApiProperty({ example: "new-user-001" })
  @IsString()
  userRef!: string;

  @ApiProperty({ type: [OnboardingAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OnboardingAnswerDto)
  answers!: OnboardingAnswerDto[];
}

export class CreateChatSessionDto {
  @ApiProperty({ example: "new-user-001" })
  @IsString()
  userRef!: string;

  @ApiProperty({ example: "beginner" })
  @IsString()
  skillLevel!: string;
}

export class AppendChatMessageDto {
  @ApiProperty({ example: "user" })
  @IsString()
  role!: string;

  @ApiProperty({ example: "Help me find a multimodal model." })
  @IsString()
  content!: string;
}

export class CreatePromptDraftDto {
  @ApiProperty({ example: "session-id" })
  @IsMongoId()
  chatSessionId!: string;

  @ApiProperty({ example: "Model comparison prompt" })
  @IsString()
  title!: string;

  @ApiProperty({ example: "Compare GPT-5 and Claude 3.7 for research work." })
  @IsString()
  body!: string;
}

export class UpdatePromptDraftDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  body?: string;
}
