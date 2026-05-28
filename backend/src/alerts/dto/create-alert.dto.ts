import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { AlertSeverity } from '../entities/alert.entity';

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  binId: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @IsString()
  @IsNotEmpty()
  location: string;
}
