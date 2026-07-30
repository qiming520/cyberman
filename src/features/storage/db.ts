/**
 * IndexedDB 存储适配器（M1-007）
 *
 * 详见 tech-design.md §5.1 / project-design-report.md §2.4。
 *
 * 设计要点：
 * - 用 `idb` 库做 Promise 包装（IndexedDB 原生是异步）
 * - 单 db `cyberman`，单 object store `kv`（key-value 通用）
 * - 每个 zustand store 用独立 key（'cyberman:souls' / 'cyberman:chat'）
 * - 提供 `idbStorage()` 工厂函数，适配 zustand persist 的 storage 接口
 *
 * 不在范围（M2+）：
 * - schema 迁移（version 字段已留接口）
 * - 加密（PRD §8.3 留未来）
 * - 实体级存储（当前存整个 state；M2 切分到 conversations/messages 表）
 */
import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'cyberman';
const DB_VERSION = 1;
const STORE_NAME = 'kv';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
        // 未来 M2 接 conversations/messages 实体级存储时
        // 在 upgrade 里根据 oldVersion 加 store
        void oldVersion;
      },
    });
  }
  return dbPromise;
}

// ─────────────────────────── 基础 KV 操作 ───────────────────────────

export async function idbGet<T = unknown>(key: string): Promise<T | null> {
  const db = await getDB();
  const value = await db.get(STORE_NAME, key);
  return (value as T) ?? null;
}

export async function idbSet(key: string, value: unknown): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, value, key);
}

export async function idbDel(key: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, key);
}

// ─────────────────────────── zustand persist 适配 ───────────────────────────

/**
 * 给 zustand persist 用的 storage 适配器。
 * 接口契约：
 *   getItem(name): Promise<string | null>
 *   setItem(name, value): Promise<void>
 *   removeItem(name): Promise<void>
 *
 * zustand persist 支持异步 storage，会在 hydration 完成前不触发写入。
 */
export function idbStorage() {
  return {
    getItem: async (name: string): Promise<string | null> => {
      try {
        const value = await idbGet<unknown>(name);
        return value === null ? null : JSON.stringify(value);
      } catch (err) {
        console.error(`[idbStorage] getItem(${name}) 失败:`, err);
        return null;
      }
    },
    setItem: async (name: string, value: string): Promise<void> => {
      try {
        await idbSet(name, JSON.parse(value));
      } catch (err) {
        console.error(`[idbStorage] setItem(${name}) 失败:`, err);
      }
    },
    removeItem: async (name: string): Promise<void> => {
      try {
        await idbDel(name);
      } catch (err) {
        console.error(`[idbStorage] removeItem(${name}) 失败:`, err);
      }
    },
  };
}

// ─────────────────────────── 测试辅助 ───────────────────────────

/** 仅供测试/E2E 清理：清空整个 IDB */
export async function clearAllIDB(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
