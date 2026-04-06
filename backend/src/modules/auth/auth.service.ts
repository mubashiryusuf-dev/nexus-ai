import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { Model } from "mongoose";

import { CreateGuestSessionDto, SignInDto, SignUpDto, SocialSignInDto } from "./dto/auth.dto";
import { AuthResponseDto, GuestSessionResponseDto } from "./dto/auth-response.dto";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) {}

  private buildTokens(userId: string, email: string, mode: string) {
    const claims = { sub: userId, email, mode };
    return {
      accessToken: this.jwtService.sign(claims),
      refreshToken: this.jwtService.sign(
        { ...claims, type: "refresh" },
        { expiresIn: "30d" }
      )
    };
  }

  async signUp(payload: SignUpDto): Promise<AuthResponseDto> {
    const existing = await this.userModel.findOne({ email: payload.email });
    if (existing) {
      throw new ConflictException("User already exists");
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);

    const user = await this.userModel.create({
      fullName: payload.fullName,
      email: payload.email,
      passwordHash,
      locale: "en"
    });

    const tokens = this.buildTokens(String(user._id), user.email, "authenticated");

    return {
      message: "Account created successfully",
      ...tokens,
      user: {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        mode: "authenticated",
        locale: user.locale
      }
    };
  }

  async signIn(payload: SignInDto): Promise<AuthResponseDto> {
    const user = await this.userModel.findOne({ email: payload.email });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(payload.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const tokens = this.buildTokens(String(user._id), user.email, "authenticated");

    return {
      message: "Signed in successfully",
      ...tokens,
      user: {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        mode: "authenticated",
        locale: user.locale
      }
    };
  }

  createGuestSession(payload: CreateGuestSessionDto): GuestSessionResponseDto {
    const accessToken = this.jwtService.sign({
      sub: "guest-session",
      mode: "guest",
      locale: payload.locale ?? "en"
    });

    return {
      mode: "guest",
      locale: payload.locale ?? "en",
      capabilities: [
        "guided-discovery",
        "marketplace-search",
        "chat-recommendations"
      ],
      accessToken
    };
  }

  async socialSignIn(payload: SocialSignInDto): Promise<AuthResponseDto> {
    const providerEmail = `${payload.provider.toLowerCase()}.oauth@nexusai.app`;
    const displayName = payload.displayName ?? `${payload.provider} User`;

    let user = await this.userModel.findOne({ email: providerEmail });

    if (!user) {
      const passwordHash = await bcrypt.hash(`OAuthProvider_${payload.provider}_2024`, 12);
      user = await this.userModel.create({
        fullName: displayName,
        email: providerEmail,
        passwordHash,
        locale: "en"
      });
    }

    const tokens = this.buildTokens(String(user._id), user.email, "authenticated");

    return {
      message: `Signed in with ${payload.provider}`,
      ...tokens,
      user: {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        mode: "authenticated",
        locale: user.locale
      }
    };
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).lean();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user as User;
  }
}
