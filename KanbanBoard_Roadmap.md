# 📋 Kanban Task Manager — Detailed Learning Roadmap (TypeScript Advanced)

> **Mục tiêu**: Xây dựng hệ thống quản lý công việc kiểu Trello/Jira bằng TypeScript nâng cao. Dự án này là bước đệm cuối cùng giúp bạn làm chủ **Generics**, **Async/Await**, **Event Emitter** và **Architecture design** trước khi chuyển sang React.

---

## 🏗️ Tổng quan Kiến trúc Hệ thống

```
KanbanBoard/
├── src/
│   ├── models/
│   │   ├── Entity.ts             ← Base Interface có ID
│   │   ├── Task.ts               ← Task data model & methods
│   │   ├── Column.ts             ← Cột chứa danh sách Task
│   │   └── Board.ts              ← Bảng chứa nhiều Column
│   ├── enums/
│   │   ├── Priority.ts           ← LOW, MEDIUM, HIGH, URGENT
│   │   └── TaskStatus.ts         ← TODO, IN_PROGRESS, REVIEW, DONE
│   ├── repository/
│   │   ├── IRepository.ts        ← Generic Interface IRepository<T>
│   │   └── InMemoryRepository.ts ← Generic Class Repository<T>
│   ├── services/
│   │   ├── MockApiService.ts     ← Giả lập API bất đồng bộ (Promise, delay)
│   │   └── BoardService.ts       ← Business logic xử lý Board & Task
│   └── events/
│       └── EventEmitter.ts       ← Pub/Sub Event engine (Mô phỏng React State/Effect)
├── test/
│   ├── Repository.test.ts
│   ├── Task.test.ts
│   ├── BoardService.test.ts
│   └── EventEmitter.test.ts
└── main.ts                       ← Chạy thử toàn bộ flow bất đồng bộ
```

---

## 📌 PHASE 1 — Generic Repository Pattern (`<T>`)

> **Mục tiêu**: Nắm vững **Generics (`<T>`)** — khái niệm cốt lõi khi dùng React với TypeScript.

### 🎯 Các bước thực hiện:

1. **Tạo Base Interface `Entity`**:
   - `id: string`
   - `createdAt: Date`
   - `updatedAt: Date`

2. **Thiết kế Generic Interface `IRepository<T extends Entity>`**:
   - `add(item: T): void`
   - `findById(id: string): T | null`
   - `findAll(): T[]`
   - `update(id: string, item: Partial<T>): boolean`
   - `delete(id: string): boolean`
   - `filter(predicate: (item: T) => boolean): T[]`

3. **Cài đặt Class `InMemoryRepository<T extends Entity>`**:
   - Quản lý mảng `private items: T[] = []`
   - Triển khai toàn bộ các hàm từ `IRepository<T>`
   - Giúp tái sử dụng 100% logic lưu trữ cho bất kỳ đối tượng nào (Task, Board, User).

---

## 📌 PHASE 2 — Core Kanban Domain Models

> **Mục tiêu**: Xây dựng mô hình dữ liệu bảng Kanban hướng đối tượng.

### 🎯 Các bước thực hiện:

1. **Định nghĩa Enum & Type**:
   - Enum `Priority`: `LOW | MEDIUM | HIGH | URGENT`
   - Enum `TaskStatus`: `TODO | IN_PROGRESS | REVIEW | DONE`
   - Subtask Interface: `{ id: string; title: string; completed: boolean }`

2. **Class `Task implements Entity`**:
   - `id`, `title`, `description`, `priority`, `status`, `dueDate?`, `subtasks: Subtask[]`
   - Method `addSubtask(title: string)`
   - Method `toggleSubtask(subtaskId: string)`
   - Method `getProgress(): number` (tính % hoàn thành subtasks)
   - Method `updateStatus(newStatus: TaskStatus)`

3. **Class `Column`**:
   - `id`, `name`, `tasks: Task[]`
   - Method `addTask(task: Task)`
   - Method `removeTask(taskId: string)`
   - Method `moveTask(taskId: string, targetColumn: Column)`

4. **Class `Board implements Entity`**:
   - `id`, `name`, `columns: Column[]`
   - Method `addColumn(name: string)`
   - Method `findTask(taskId: string): Task | null`
   - Method `moveTaskBetweenColumns(taskId: string, fromColId: string, toColId: string)`

---

## 📌 PHASE 3 — Async Mock API & Services (`Promise` & `async/await`)

> **Mục tiêu**: Làm quen với lập trình **Bất đồng bộ (Asynchronous)** chuẩn bị cho việc làm việc với API / Server trong React.

### 🎯 Các bước thực hiện:

1. **Viết `MockApiService`**:
   - Hàm `delay(ms: number): Promise<void>` mô phỏng độ trễ mạng (500ms - 1000ms).
   - Hàm `fetchTasks(): Promise<Task[]>` — giả lập tải dữ liệu từ server.
   - Hàm `saveTask(task: Task): Promise<boolean>` — giả lập lưu xuống database.
   - Hàm `deleteTask(id: string): Promise<boolean>`

2. **Viết `BoardService`**:
   - Kết hợp `InMemoryRepository<Task>` và `MockApiService`.
   - `async createTask(title: string, priority: Priority): Promise<Task>`
   - `async moveTask(taskId: string, newStatus: TaskStatus): Promise<boolean>`
   - `async searchTasks(keyword: string): Promise<Task[]>`
   - `async getOverdueTasks(): Promise<Task[]>` (lấy các task quá hạn `dueDate`)

---

## 📌 PHASE 4 — Event-Driven State Engine (Pub/Sub Pattern)

> **Mục tiêu**: Hiểu bản chất cách React lắng nghe và phản ứng khi dữ liệu thay đổi (State & Effects).

### 🎯 Các bước thực hiện:

1. **Tạo Class `EventEmitter`**:
   - `listeners: Map<string, Function[]>`
   - `on(event: string, callback: Function): void` — đăng ký lắng nghe sự kiện
   - `emit(event: string, data?: any): void` — phát sự kiện
   - `off(event: string, callback: Function): void` — hủy đăng ký

2. **Tích hợp Event vào `BoardService`**:
   - Bắn sự kiện `"TASK_CREATED"` khi có task mới.
   - Bắn sự kiện `"TASK_MOVED"` khi task đổi cột (ví dụ từ `TODO` sang `IN_PROGRESS`).
   - Bắn sự kiện `"TASK_COMPLETED"` khi toàn bộ subtask hoàn thành.

---

## 📌 PHASE 5 — Automated Unit Testing & Integration Flow

> **Mục tiêu**: Đảm bảo toàn bộ hệ thống (kể cả async code & generics) đều được test 100%.

### 🎯 Các bước thực hiện:

1. **Unit Test Generic Repository**:
   - Kiểm tra `add`, `findById`, `update`, `delete`, `filter` trên mảng Generics.

2. **Unit Test Async Services (`async/await`)**:
   - Viết test thử nghiệm các hàm `async` bằng `vitest` (`expect(await service.createTask(...)).toBeDefined()`).

3. **Unit Test Event Listener**:
   - Kiểm tra callback có được kích hoạt đúng khi phát sự kiện hay không.

4. **Kịch bản tích hợp hoàn chỉnh (`main.ts`)**:
   - Khởi tạo Board ➔ Tạo Task ➔ Đổi trạng thái Async ➔ Nhận thông báo từ Event Emitter ➔ Hoàn thành đơn hàng.

---

## 🏁 Kết quả đầu ra sau khi hoàn thành dự án này:

1. **Nắm vững Generics (`<T>`)**: Tự tin đọc và viết bất kỳ code TS nào trong React.
2. **Thành thạo `async/await` & `Promise`**: Sẵn sàng kết nối Frontend với REST API / Backend.
3. **Hiểu kiến trúc Pub/Sub & State**: Dễ dàng hấp thụ `useState`, `useEffect`, `useContext`, `Redux` trong React.
