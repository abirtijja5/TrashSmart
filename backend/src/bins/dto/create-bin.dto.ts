import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { WasteType } from '../entities/bin.entity';

export class CreateBinDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsOptional()
  @IsEnum(WasteType)
  type?: WasteType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  fillLevel?: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
