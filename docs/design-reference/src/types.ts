export type AppTab = 'cockpit' | 'journey' | 'stops' | 'checklist' | 'truck';

export type DriverStatus = 'DRIVING' | 'RESTING' | 'WAITING' | 'MEAL' | 'SLEEPING';

export type AppTheme = 'dark-cockpit' | 'solar-contrast' | 'dark-amber' | 'clean-light';

export interface DriverInfo {
  name: string;
  photoUrl: string;
  cnh: string;
  category: string;
  cpf: string;
  company: string;
  badgeNumber: string;
  score: number; // Eco-driving & segurança
  completedTrips: number;
}

export interface TruckTelemetry {
  model: string;
  plate: string;
  type: string; // "Bitrem 9 Eixos - Graneleiro" / "Carreta Baú Frigorífico"
  speed: number;
  speedLimit: number;
  fuelLevelPercent: number;
  dieselRangeKm: number;
  avgConsumption: number; // km/L
  arla32Percent: number;
  tirePressure: {
    frontLeft: number;
    frontRight: number;
    trailer1Avg: number;
    trailer2Avg: number;
    status: 'ok' | 'warning' | 'alert';
  };
  cargoTemp?: number; // Para frigorífico
  cargoLockStatus: 'locked' | 'unlocked';
  weightTon: number;
  maxWeightTon: number;
}

export interface RouteProgress {
  origin: string;
  destination: string;
  highway: string; // ex: "BR-116 (Via Dutra)"
  totalDistanceKm: number;
  remainingDistanceKm: number;
  totalDurationHours: number;
  remainingDurationHours: number;
  eta: string;
  cargoType: string;
  cteNumber: string;
  nextEvent: {
    type: 'toll' | 'scale' | 'rest' | 'radar' | 'delivery';
    title: string;
    distanceKm: number;
    timeMinutes: number;
    cost?: number;
    extraInfo?: string;
  };
}

export interface JourneyLog {
  id: string;
  timestamp: string;
  status: DriverStatus;
  location: string;
  durationMinutes: number;
  notes?: string;
}

export interface TruckStop {
  id: string;
  name: string;
  brand: 'Graal' | 'Ipiranga' | 'Shell' | 'Petrobras' | 'Independente';
  highway: string;
  kmMark: number;
  distanceAheadKm: number;
  dieselPrice: number;
  rating: number;
  reviewsCount: number;
  secureParking: boolean;
  parkingSlotsFree: number;
  amenities: {
    shower: boolean;
    showerHot: boolean;
    wifi: boolean;
    restaurant24h: boolean;
    tireShop: boolean; // Borracharia
    mechanic: boolean;
    security24h: boolean;
    laundry: boolean;
    bitremAccess: boolean;
  };
  phone: string;
  photoUrl?: string;
}

export interface ChecklistItem {
  id: string;
  category: 'Pneus e Rodas' | 'Luzes e Elétrica' | 'Fluidos e Motor' | 'Carga e Segurança';
  title: string;
  description: string;
  status: 'pending' | 'ok' | 'issue';
  required: boolean;
}

export interface AlertNotification {
  id: string;
  type: 'radar' | 'rest_required' | 'scale' | 'weather' | 'mechanical';
  title: string;
  message: string;
  urgency: 'high' | 'medium' | 'low';
  time: string;
}
