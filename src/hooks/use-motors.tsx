import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  addMotor as addMotorStore,
  deleteMotor as deleteMotorStore,
  loadMotors,
  type Motor,
  searchMotors,
  type SearchFilters,
  updateMotor as updateMotorStore,
} from '@/lib/motors';

type MotorsContextValue = {
  motors: Motor[];
  loading: boolean;
  refresh: () => Promise<void>;
  add: (motor: Motor) => Promise<void>;
  update: (motor: Motor) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => Motor | undefined;
  search: (filters: SearchFilters) => Motor[];
};

const MotorsContext = createContext<MotorsContextValue | null>(null);

export function MotorsProvider({ children }: { children: ReactNode }) {
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await loadMotors();
    setMotors(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (motor: Motor) => {
    const next = await addMotorStore(motor);
    setMotors(next);
  }, []);

  const update = useCallback(async (motor: Motor) => {
    const next = await updateMotorStore(motor);
    setMotors(next);
  }, []);

  const remove = useCallback(async (id: string) => {
    const next = await deleteMotorStore(id);
    setMotors(next);
  }, []);

  const getById = useCallback(
    (id: string) => motors.find((m) => m.id === id),
    [motors],
  );

  const search = useCallback((filters: SearchFilters) => searchMotors(motors, filters), [motors]);

  const value = useMemo<MotorsContextValue>(
    () => ({ motors, loading, refresh, add, update, remove, getById, search }),
    [motors, loading, refresh, add, update, remove, getById, search],
  );

  return <MotorsContext.Provider value={value}>{children}</MotorsContext.Provider>;
}

export function useMotors(): MotorsContextValue {
  const ctx = useContext(MotorsContext);
  if (!ctx) throw new Error('useMotors must be used within a MotorsProvider');
  return ctx;
}
