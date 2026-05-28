import { IsString, IsOptional, IsEnum, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { WasteType } from '../entities/bin.entity';

export class UpdateBinDto {
  @IsOptional()
  @IsString()
  location?: string;

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
