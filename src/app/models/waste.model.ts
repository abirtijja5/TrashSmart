export interface WasteType {
  type: string; kg: number; percent: number; color: string; icon: string;
}
export interface WasteStats {
  totalCollected: number; sortingEfficiency: number; activeBins: number;
  fullBins: number; alertsCount: number; co2Saved: number; wasteTypes: WasteType[];
}
export interface WeeklyData {
  day: string; plastique: number; verre: number; papier: number; metal: number; organique: number;
}
export interface EfficiencyData { date: string; efficiency: number; }
export interface BinStatus {
  id: string; location: string; type: string; fillLevel: number;
  status: 'normal' | 'warning' | 'critical'; lastUpdate: string | Date | null;
}
export interface AlertEvent {
  id: number; binId: string; message: string; severity: 'warning' | 'critical';
  createdAt: string | Date; location: string; acknowledgedAt?: string | Date | null;
}
