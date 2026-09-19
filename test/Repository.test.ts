import { describe, it, expect } from "vitest";
import { Entity } from "../src/Entity_Interface";
import { InMemoryRepository } from "../src/InMemoryRepository";

interface TestItem extends Entity {
    name: string;
    score: number;
}

describe("InMemoryRepository Edge Cases & Full Coverage", () => {
    const makeItem = (id: string, name: string, score: number): TestItem => ({
        id,
        name,
        score,
        createAt: new Date(2026, 0, 1),
        updateAt: new Date(2026, 0, 1),
    });

    // ─── 1. findAll() Encapsulation & Immutability ─────────────────
    describe("findAll() Edge Cases", () => {
        it("should return an empty array when repo is empty", () => {
            const repo = new InMemoryRepository<TestItem>();
            expect(repo.findAll()).toEqual([]);
        });

        it("should return a new array copy to prevent external mutation", () => {
            const repo = new InMemoryRepository<TestItem>();
            repo.add(makeItem("1", "Alice", 90));

            const list = repo.findAll();
            list.pop(); // External mutation attempt

            expect(repo.findAll().length).toBe(1); // Internal items array remains intact!
        });
    });

    // ─── 2. findById() Edge Cases ──────────────────────────────────
    describe("findById() Edge Cases", () => {
        it("should return null for empty repo or non-existent id", () => {
            const repo = new InMemoryRepository<TestItem>();
            expect(repo.findById("1")).toBeNull();
            expect(repo.findById("")).toBeNull();
        });

        it("should find the exact item among multiple items", () => {
            const repo = new InMemoryRepository<TestItem>();
            repo.add(makeItem("1", "Alice", 90));
            repo.add(makeItem("2", "Bob", 80));
            repo.add(makeItem("3", "Charlie", 70));

            const item = repo.findById("2");
            expect(item?.name).toBe("Bob");
        });
    });

    // ─── 3. update() Edge Cases ────────────────────────────────────
    describe("update() Edge Cases", () => {
        it("should return false when updating a non-existent item", () => {
            const repo = new InMemoryRepository<TestItem>();
            expect(repo.update("999", { name: "Ghost" })).toBe(false);
        });

        it("should partially update fields without erasing other fields", () => {
            const repo = new InMemoryRepository<TestItem>();
            const originalDate = new Date(2026, 0, 1);
            repo.add(makeItem("1", "Alice", 90));

            // Update ONLY score
            const success = repo.update("1", { score: 100 });
            expect(success).toBe(true);

            const updated = repo.findById("1");
            expect(updated?.name).toBe("Alice"); // Name preserved!
            expect(updated?.score).toBe(100);  // Score updated!
            expect(updated?.updateAt.getTime()).toBeGreaterThan(originalDate.getTime()); // updateAt updated!
        });
    });

    // ─── 4. delete() Edge Cases ────────────────────────────────────
    describe("delete() Edge Cases", () => {
        it("should return false when deleting from an empty repo", () => {
            const repo = new InMemoryRepository<TestItem>();
            expect(repo.delete("1")).toBe(false);
        });

        it("should return false when trying to delete the same item twice", () => {
            const repo = new InMemoryRepository<TestItem>();
            repo.add(makeItem("1", "Alice", 90));

            expect(repo.delete("1")).toBe(true);  // First delete works
            expect(repo.delete("1")).toBe(false); // Second delete fails
            expect(repo.findAll().length).toBe(0);
        });

        it("should correctly delete first, middle, or last item in array", () => {
            const repo = new InMemoryRepository<TestItem>();
            repo.add(makeItem("1", "Item1", 10));
            repo.add(makeItem("2", "Item2", 20));
            repo.add(makeItem("3", "Item3", 30));

            // Delete middle item
            repo.delete("2");
            expect(repo.findAll().map(i => i.id)).toEqual(["1", "3"]);
        });
    });

    // ─── 5. filter() Edge Cases ────────────────────────────────────
    describe("filter() Edge Cases", () => {
        it("should return empty array when filtering empty repo", () => {
            const repo = new InMemoryRepository<TestItem>();
            expect(repo.filter(item => item.score > 50)).toEqual([]);
        });

        it("should return empty array when no items match predicate", () => {
            const repo = new InMemoryRepository<TestItem>();
            repo.add(makeItem("1", "Alice", 90));
            expect(repo.filter(item => item.score < 50)).toEqual([]);
        });

        it("should return all items when predicate matches everything", () => {
            const repo = new InMemoryRepository<TestItem>();
            repo.add(makeItem("1", "Alice", 90));
            repo.add(makeItem("2", "Bob", 80));

            const results = repo.filter(item => item.score > 0);
            expect(results.length).toBe(2);
        });
    });
});
