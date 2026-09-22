
import { Column } from "./Column";
import { Entity } from "./Entity_Interface";
import { Task } from "./Task";

export class Board implements Entity {
    id: string;
    name: string;
    columns: Column[] = [];
    createAt: Date;
    updateAt: Date;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.createAt = new Date();
        this.updateAt = new Date();
    }

    addColumn(name: string) {
        let newColumn = new Column("COLUMN" + Date.now(), name);
        this.columns.push(newColumn);
        this.updateAt = new Date();
    }

    findTask(taskId: string): Task | null {
        for (const temp of this.columns) {
            let target = temp.tasks.find(temp2 => temp2.id === taskId)
            if (target) return target
        }
        return null
    }

    moveTaskBetweenColumns(taskId: string, fromColumn: Column, toColumn: Column) {
        const task = this.findTask(taskId)
        if (task && fromColumn !== toColumn) {
            fromColumn.removeTask(taskId)
            toColumn.addTask(task)
            task.updateAt = new Date()
            this.updateAt = new Date()
        }
    }
}