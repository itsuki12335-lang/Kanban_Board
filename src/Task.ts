import { Entity } from "./Entity_Interface";
import { Priority } from "./EPriority";
import { TaskStatus } from "./ETaskStatus";
import { Subtask } from "./ISubtask";

export class Task implements Entity {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: TaskStatus;
    dueDate?: Date;
    subtask: Subtask[] = [];
    createAt: Date;
    updateAt: Date;

    constructor(
        id: string,
        title: string,
        description: string,
        priority: Priority = Priority.MEDIUM,
        status: TaskStatus = TaskStatus.TODO,
        dueDate?: Date
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
        this.createAt = new Date();
        this.updateAt = new Date();
    }

    addSubtask(title: string) {
        let task = { id: "SUB-" + Date.now() + "-" + Math.floor(Math.random() * 10000), title: title, completed: false };
        this.subtask.push(task);
    }

    toggleSubtask(idSubtask: string) {
        const st = this.subtask.find(temp => temp.id === idSubtask);
        if (st) {
            st.completed = !st.completed;
        }
    }

    getProgress(): number {
        if (this.subtask.length === 0) return 0;
        else {
            let count = 0;
            for (const temp of this.subtask) {
                if (temp.completed === true) count++;
            }
            return (count / this.subtask.length) * 100;
        }
    }

    updateStatus(newTaskStatus: TaskStatus): void {
        this.status = newTaskStatus;
        this.updateAt = new Date();
    }

    updatePriority(newPrioriry: Priority): void {
        this.priority = newPrioriry;
        this.updateAt = new Date();
    }
}