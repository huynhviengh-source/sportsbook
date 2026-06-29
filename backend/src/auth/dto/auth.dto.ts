import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString() @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
  password: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  full_name: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  password: string;
}