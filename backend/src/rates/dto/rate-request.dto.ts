import { IsString, IsNumber, IsOptional, Min, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RateRequestDto {
  @ApiProperty({
    description: 'The ZIP code of the origin location',
    example: '90210',
    minLength: 5,
    maxLength: 10,
  })
  @IsString()
  @Length(5, 10)
  originZip: string;

  @ApiProperty({
    description: 'The ZIP code of the destination location',
    example: '10001',
    minLength: 5,
    maxLength: 10,
  })
  @IsString()
  @Length(5, 10)
  destZip: string;

  @ApiProperty({
    description: 'The weight of the package in pounds',
    example: 1.5,
    minimum: 0.1,
  })
  @IsNumber()
  @Min(0.1)
  weightLbs: number;

  @ApiProperty({
    description: 'The length of the package in inches',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  lengthIn?: number;

  @ApiProperty({
    description: 'The width of the package in inches',
    example: 8,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  widthIn?: number;

  @ApiProperty({
    description: 'The height of the package in inches',
    example: 6,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  heightIn?: number;

  @ApiProperty({
    description: 'The service code for a specific shipping level (optional)',
    example: '03',
    required: false,
  })
  @IsString()
  @IsOptional()
  serviceCode?: string;
}
