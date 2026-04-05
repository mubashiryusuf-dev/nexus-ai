import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { CreateGuestSessionDto, SignInDto, SignUpDto } from "./dto/auth.dto";
import { AuthResponseDto, GuestSessionResponseDto } from "./dto/auth-response.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  @ApiOperation({ summary: "Create a new authenticated user" })
  @ApiCreatedResponse({ description: "User account created", type: AuthResponseDto })
  signUp(@Body() payload: SignUpDto): Promise<AuthResponseDto> {
    return this.authService.signUp(payload);
  }

  @Post("sign-in")
  @ApiOperation({ summary: "Authenticate an existing user" })
  @ApiOkResponse({ description: "User authenticated", type: AuthResponseDto })
  signIn(@Body() payload: SignInDto): Promise<AuthResponseDto> {
    return this.authService.signIn(payload);
  }

  @Post("guest-session")
  @ApiOperation({ summary: "Start guest mode before authentication" })
  @ApiCreatedResponse({ description: "Guest session created", type: GuestSessionResponseDto })
  createGuestSession(
    @Body() payload: CreateGuestSessionDto
  ): GuestSessionResponseDto {
    return this.authService.createGuestSession(payload);
  }

  @Get("profile/:id")
  @ApiOperation({ summary: "Get authenticated user profile" })
  @ApiOkResponse({ description: "Profile returned" })
  getProfile(@Param("id") id: string) {
    return this.authService.getProfile(id);
  }
}
