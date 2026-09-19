import { Entity } from "./Entity_Interface";
export interface IRepository<T extends Entity> {
    add(task: T): void;
    findById(id: string): T | null;
    findAll(): T[];
    update(id: string, task: Partial<T>): boolean;
    delete(id: string): boolean;
    filter(predicate: (task: T) => boolean): T[];
}