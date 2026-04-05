import { ApiProperty } from "@nestjs/swagger";

class AuthUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ example: "authenticated" })
  mode!: string;

  @ApiProperty()
  locale!: string;
}

export class AuthResponseDto {
  @ApiProperty()
  message!: string;

  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty({ type: AuthUserDto })
  user!: AuthUserDto;
}

export class GuestSessionResponseDto {
  @ApiProperty({ example: "guest" })
  mode!: string;

  @ApiProperty()
  locale!: string;

  @ApiProperty({ type: [String] })
  capabilities!: string[];

  @ApiProperty()
  accessToken!: string;
}
