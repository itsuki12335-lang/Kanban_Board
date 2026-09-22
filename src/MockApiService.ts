import { Task } from "./Task";

export class MockApiService {
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    async fetchTasks(): Promise<Task[]> {
        await this.delay(500);
        const t1 = new Task("T1", "Hoc Async / Await ", "B1");
        const t2 = new Task("B", "Hoc Async / Await ", "B1");
        return [t1, t2]
    }
    async saveTask(task: Task): Promise<boolean> {
        await this.delay(1000);
        return true
    }
    async deleteTask(taskid: string): Promise<boolean> {
        await this.delay(300);
        return true
    }
}

