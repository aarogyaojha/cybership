import { IsString, IsNumber, IsOptional, Min, Length } from 'class-validator';

export class RateRequestDto {
  @IsString()
  @Length(5, 10)
  originZip: string;

  @IsString()
  @Length(5, 10)
  destZip: string;

  @IsNumber()
  @Min(0.1)
  weightLbs: number;

  @IsNumber()
  @IsOptional()
  lengthIn?: number;

  @IsNumber()
  @IsOptional()
  widthIn?: number;

  @IsNumber()
  @IsOptional()
  heightIn?: number;

  @IsString()
  @IsOptional()
  serviceCode?: string;
}
