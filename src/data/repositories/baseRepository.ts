// src/data/repositories/baseRepository.ts
export interface Repository<T> {
  list(): Promise<T[]>;
  create(item: T): Promise<T>;
  update(item: T): Promise<T>;
  remove(id: string): Promise<void>;
}
