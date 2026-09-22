import { describe, it, expect } from "vitest";
import { Task } from "../src/Task";
import { Column } from "../src/Column";
import { Board } from "../src/Board";
import { Priority } from "../src/EPriority";
import { TaskStatus } from "../src/ETaskStatus";

describe("Task Model Edge Cases & Full Coverage", () => {
    // ─── 1. getProgress() Edge Cases ──────────────────────────────
    describe("getProgress() Edge Cases", () => {
        it("should return 0 when subtasks array is empty", () => {
            const task = new Task("T1", "Empty Subtasks", "Test description");
            expect(task.getProgress()).toBe(0);
        });

        it("should return 100 when all subtasks are completed", () => {
            const task = new Task("T1", "All Completed", "Test description");
            task.addSubtask("Sub 1");
            task.addSubtask("Sub 2");

            const s1Id = task.subtask[0].id;
            const s2Id = task.subtask[1].id;

            task.toggleSubtask(s1Id);
            task.toggleSubtask(s2Id);
            expect(task.getProgress()).toBe(100);
        });

        it("should correctly handle progress percentage calculation (e.g., 1 out of 3 = 33%)", () => {
            const task = new Task("T1", "Fraction Progress", "Test description");
            task.addSubtask("Sub 1");
            task.addSubtask("Sub 2");
            task.addSubtask("Sub 3");

            const s1Id = task.subtask[0].id;
            task.toggleSubtask(s1Id);
            expect(task.getProgress()).toBeCloseTo(33.33, 1);
        });
    });

    // ─── 2. toggleSubtask() Edge Cases ────────────────────────────
    describe("toggleSubtask() Edge Cases", () => {
        it("should safely handle non-existent subtask ID without errors", () => {
            const task = new Task("T1", "Toggle Ghost", "Test description");
            task.addSubtask("Real Subtask");

            task.toggleSubtask("SUB-NON-EXISTENT");
            expect(task.subtask[0].completed).toBe(false); // Real subtask remains unchanged
        });

        it("should toggle the same subtask back and forth multiple times", () => {
            const task = new Task("T1", "Multiple Toggles", "Test description");
            task.addSubtask("Sub 1");
            const s1Id = task.subtask[0].id;

            expect(task.subtask[0].completed).toBe(false);

            task.toggleSubtask(s1Id);
            expect(task.subtask[0].completed).toBe(true);

            task.toggleSubtask(s1Id);
            expect(task.subtask[0].completed).toBe(false);

            task.toggleSubtask(s1Id);
            expect(task.subtask[0].completed).toBe(true);
        });
    });

    // ─── 3. updateStatus() & updatePriority() Edge Cases ─────────
    describe("Status & Priority Updates Edge Cases", () => {
        it("should update status and refresh updateAt timestamp", async () => {
            const task = new Task("T1", "Update Status", "Test description");
            const initialUpdateAt = task.updateAt;

            await new Promise(res => setTimeout(res, 10));

            task.updateStatus(TaskStatus.DONE);
            expect(task.status).toBe(TaskStatus.DONE);
            expect(task.updateAt.getTime()).toBeGreaterThanOrEqual(initialUpdateAt.getTime());
        });

        it("should update priority and refresh updateAt timestamp", async () => {
            const task = new Task("T1", "Update Priority", "Test description");
            const initialUpdateAt = task.updateAt;

            await new Promise(res => setTimeout(res, 10));

            task.updatePriority(Priority.URGENT);
            expect(task.priority).toBe(Priority.URGENT);
            expect(task.updateAt.getTime()).toBeGreaterThanOrEqual(initialUpdateAt.getTime());
        });
    });

    // ─── 4. Optional dueDate Field ─────────────────────────────────
    describe("dueDate Property Edge Cases", () => {
        it("should allow task creation with or without optional dueDate", () => {
            const taskNoDate = new Task("T1", "No Date", "Desc");
            expect(taskNoDate.dueDate).toBeUndefined();

            const deadline = new Date(2026, 11, 31);
            const taskWithDate = new Task("T2", "With Date", "Desc", Priority.HIGH, TaskStatus.TODO, deadline);
            expect(taskWithDate.dueDate).toEqual(deadline);
        });
    });
});

describe("Column Model", () => {
    it("should add, remove, and move tasks between columns", () => {
        const colTodo = new Column("COL-1", "TODO");
        const colDone = new Column("COL-2", "DONE");
        const task1 = new Task("T1", "Task 1", "Desc 1");
        const task2 = new Task("T2", "Task 2", "Desc 2");

        // Add tasks
        colTodo.addTask(task1);
        colTodo.addTask(task2);
        expect(colTodo.tasks.length).toBe(2);

        // Move task1 from colTodo to colDone
        colTodo.moveTask(task1, colDone);
        expect(colTodo.tasks.length).toBe(1);
        expect(colDone.tasks.length).toBe(1);
        expect(colDone.tasks[0].id).toBe("T1");

        // Remove task2
        colTodo.removeTask("T2");
        expect(colTodo.tasks.length).toBe(0);
    });
});

describe("Board Model", () => {
    it("should add columns and find tasks across columns", () => {
        const board = new Board("B1", "Project Board");
        board.addColumn("TODO");
        board.addColumn("DONE");

        expect(board.columns.length).toBe(2);
        expect(board.columns[0].name).toBe("TODO");

        const task1 = new Task("T1", "Task 1", "Desc 1");
        board.columns[0].addTask(task1);

        const found = board.findTask("T1");
        expect(found).not.toBeNull();
        expect(found?.title).toBe("Task 1");

        const notFound = board.findTask("GHOST-ID");
        expect(notFound).toBeNull();
    });

    it("should move tasks between columns using Board", () => {
        const board = new Board("B1", "Project Board");
        const colTodo = new Column("COL-1", "TODO");
        const colDone = new Column("COL-2", "DONE");
        board.columns.push(colTodo, colDone);

        const task = new Task("T1", "Moving Task", "Desc");
        colTodo.addTask(task);

        board.moveTaskBetweenColumns("T1", colTodo, colDone);

        expect(colTodo.tasks.length).toBe(0);
        expect(colDone.tasks.length).toBe(1);
        expect(colDone.tasks[0].id).toBe("T1");
    });
});


