import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { WasteType } from '../../bins/entities/bin.entity';

export class CreateCollectionDto {
  @IsString()
  binId: string;

  @IsEnum(WasteType)
  wasteType: WasteType;

  @IsNumber()
  @Min(0)
  weightKg: number;

  @IsString()
  @IsOptional()
  collectedBy?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  collectedAt?: string;
}
