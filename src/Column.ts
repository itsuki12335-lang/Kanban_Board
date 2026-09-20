import { Task } from "./Task";

export class Column {
    id: string;
    name: string;
    tasks: Task[] = [];

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    addTask(task: Task): void {
        this.tasks.push(task);
    }

    removeTask(taskId: string): void {
        const index = this.tasks.findIndex(temp => temp.id === taskId);
        if (index !== -1) {
            this.tasks.splice(index, 1);
        }
    }

    moveTask(task: Task, targetColumn: Column): void {
        targetColumn.addTask(task);
        this.removeTask(task.id);
    }
}