/**
 * Generic repository interface — the CMS swap boundary.
 * All mock repos implement this interface.
 * When Payload CMS is introduced, only the repo files in /payload/ change.
 */
export interface IRepository<T extends { id: string }> {
  findAll(filters?: Partial<Record<string, unknown>>): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
