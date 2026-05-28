import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty()
  binId: string;

  @IsString()
  @IsNotEmpty()
  wasteType: string;

  @IsNumber()
  @Min(0)
  weightKg: number;

  @IsOptional()
  @IsString()
  collectedBy?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  collectedAt?: string;
}
