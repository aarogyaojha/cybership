import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user (minimum 8 characters)',
    example: 'strongPassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}

