import AsyncStorage from '@react-native-async-storage/async-storage';

export type MotorType = 'single-phase' | 'three-phase';

export type ConnectionType = 'star' | 'delta' | 'series' | 'parallel';

export interface WindingInfo {
  pitch: string;
  turns: string;
  swg: string;
  connection: string;
  coils?: string;
  wireDiameter?: string;
}

export interface ThreePhaseWinding extends WindingInfo {
  coilGroups?: string;
  slots?: string;
}

export interface Motor {
  id: string;
  type: MotorType;
  createdAt: number;
  updatedAt: number;

  // Basic information
  name: string;
  manufacturer: string;
  model: string;
  hp: string;
  kw: string;
  voltage: string;
  current: string;
  rpm: string;
  frequency: string;

  // Winding — running winding (always present)
  runningWinding: WindingInfo;

  // Starting winding — single-phase only
  startingWinding?: WindingInfo;

  // Three-phase winding fields
  threePhaseWinding?: ThreePhaseWinding;

  notes?: string;
}

const STORAGE_KEY = 'nextgen.motors.v1';

function uid(): string {
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyMotor(type: MotorType = 'three-phase'): Motor {
  const now = Date.now();
  return {
    id: uid(),
    type,
    createdAt: now,
    updatedAt: now,
    name: '',
    manufacturer: '',
    model: '',
    hp: '',
    kw: '',
    voltage: '',
    current: '',
    rpm: '',
    frequency: '50',
    runningWinding: { pitch: '', turns: '', swg: '', connection: '' },
    notes: '',
    ...(type === 'single-phase'
      ? { startingWinding: { pitch: '', turns: '', swg: '', connection: '' } }
      : { threePhaseWinding: { pitch: '', turns: '', swg: '', connection: '' } }),
  };
}

export async function loadMotors(): Promise<Motor[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Motor[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('loadMotors failed', err);
    return [];
  }
}

export async function saveMotors(motors: Motor[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(motors));
}

export async function addMotor(motor: Motor): Promise<Motor[]> {
  const motors = await loadMotors();
  const next = [motor, ...motors];
  await saveMotors(next);
  return next;
}

export async function updateMotor(motor: Motor): Promise<Motor[]> {
  const motors = await loadMotors();
  const next = motors.map((m) => (m.id === motor.id ? { ...motor, updatedAt: Date.now() } : m));
  await saveMotors(next);
  return next;
}

export async function deleteMotor(id: string): Promise<Motor[]> {
  const motors = await loadMotors();
  const next = motors.filter((m) => m.id !== id);
  await saveMotors(next);
  return next;
}

export interface SearchFilters {
  query?: string;
  type?: MotorType;
}

export function searchMotors(motors: Motor[], filters: SearchFilters): Motor[] {
  const q = filters.query?.trim().toLowerCase();
  const type = filters.type;
  if (!q && !type) return motors;
  return motors.filter((m) => {
    if (type && m.type !== type) return false;
    if (!q) return true;
    const haystack = [
      m.name,
      m.manufacturer,
      m.model,
      m.hp,
      m.rpm,
      m.voltage,
      m.current,
      m.frequency,
      `${m.type}`,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}
