import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { BinStatus, WasteType } from '../entities/bin.entity';

export class UpdateBinDto {
  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(WasteType)
  @IsOptional()
  type?: WasteType;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  fillLevel?: number;

  @IsEnum(BinStatus)
  @IsOptional()
  status?: BinStatus;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
