import { Entity } from "./Entity_Interface";
import { IRepository } from "./IRepository";
export class InMemoryRepository<T extends Entity> implements IRepository<T> {
    private items: T[] = [];
    add(item: T) {
        this.items.push(item);
    }
    findById(id: string): T | null {
        const item = this.items.find(temp => temp.id === id);
        if (item) return item;
        else return null;
    }
    findAll(): T[] {
        return [...this.items];
    }
    update(id: string, task: Partial<T>): boolean {
        const item = this.items.find(temp => temp.id === id);
        if (item) {
            Object.assign(item, task,);
            item.updateAt = new Date();
            return true;
        } else return false;
    }
    delete(id: string): boolean {
        const index = this.items.findIndex(temp => temp.id === id)
        if (index !== -1) {
            this.items.splice(index, 1)
            return true
        } else return false
    }
    filter(predicate: (task: T) => boolean): T[] {
        const fil: T[] = []
        for (const item of this.items) {
            if (predicate(item)) fil.push(item);
        }
        return fil
    }
}
