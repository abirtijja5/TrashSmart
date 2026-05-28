import {
  IsEnum, IsNumber, IsOptional, IsString, Length, Max, Min,
} from 'class-validator';
import { WasteType } from '../entities/bin.entity';

export class CreateBinDto {
  @IsString()
  @Length(2, 20)
  id: string;

  @IsString()
  location: string;

  @IsEnum(WasteType)
  type: WasteType;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  fillLevel?: number;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}
