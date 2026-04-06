import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";

import { ChatService } from "./chat.service";
import { ChatHistoryItemDto, ChatMessageResponseDto, SendMessageDto } from "./dto/chat.dto";

@ApiTags("chat")
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("send")
  @ApiOperation({
    summary: "Send a chat message and receive an AI response",
    description: "Accepts a user message with optional model and context. Returns a realistic AI reply with a 300–800ms simulated delay."
  })
  @ApiOkResponse({ description: "AI reply returned", type: ChatMessageResponseDto })
  sendMessage(@Body() payload: SendMessageDto): Promise<ChatMessageResponseDto> {
    return this.chatService.sendMessage(payload);
  }

  @Get("history")
  @ApiOperation({ summary: "Retrieve full chat history for this session" })
  @ApiOkResponse({ description: "Chat history returned", type: [ChatHistoryItemDto] })
  getHistory(): ChatHistoryItemDto[] {
    return this.chatService.getHistory();
  }

  @Delete("clear")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Clear all chat history for this session" })
  @ApiNoContentResponse({ description: "History cleared" })
  clearHistory(): { cleared: boolean; count: number } {
    return this.chatService.clearHistory();
  }
}
