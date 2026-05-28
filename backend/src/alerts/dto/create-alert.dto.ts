import { IsEnum, IsString } from 'class-validator';
import { AlertSeverity } from '../entities/alert.entity';

export class CreateAlertDto {
  @IsString()
  binId: string;

  @IsString()
  message: string;

  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @IsString()
  location: string;
}
