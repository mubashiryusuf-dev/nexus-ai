import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthService } from "./auth.service";
import { CreateGuestSessionDto, SignInDto, SignUpDto, SocialSignInDto } from "./dto/auth.dto";
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

  @Post("social-sign-in")
  @ApiOperation({ summary: "Sign in or auto-register via OAuth provider (Google, GitHub, Microsoft)" })
  @ApiOkResponse({ description: "OAuth user authenticated", type: AuthResponseDto })
  socialSignIn(@Body() payload: SocialSignInDto): Promise<AuthResponseDto> {
    return this.authService.socialSignIn(payload);
  }

  @Post("guest-session")
  @ApiOperation({ summary: "Start guest mode before authentication" })
  @ApiCreatedResponse({ description: "Guest session created", type: GuestSessionResponseDto })
  createGuestSession(@Body() payload: CreateGuestSessionDto): GuestSessionResponseDto {
    return this.authService.createGuestSession(payload);
  }

  @Get("profile/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get authenticated user profile" })
  @ApiOkResponse({ description: "Profile returned" })
  @ApiUnauthorizedResponse({ description: "Invalid or missing token" })
  getProfile(@Param("id") id: string) {
    return this.authService.getProfile(id);
  }
}
