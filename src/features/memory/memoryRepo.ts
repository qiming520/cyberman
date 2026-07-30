/**
 * 长期记忆仓库（Sprint #7 · M7-002）
 *
 * 详见 tech-design.md §4.3 / project-design-report.md §4.3
 *
 * 设计：
 * - 每个 soul 有独立 memories 列表
 * - 每条 memory 是 LLM summarizer 生成的「事实摘要」（自然语言）
 * - 存储到 IDB；新会话开始时检索最近 N 条注入 system prompt
 *
 * 不在本阶段（M2 末可加）：
 * - 向量检索（embeddings + LanceDB 相似度）
 * - 重要度评分排序
 * - 自动合并冗余
 */
import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'cyberman';
const DB_VERSION = 2;  // 升级 v2：加 memories store
const STORE = 'memories';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          // db.ts 中已建 kv store
        }
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains(STORE)) {
            const memStore = db.createObjectStore(STORE, { keyPath: 'id' });
            memStore.createIndex('by_soul', 'soulId');
            memStore.createIndex('by_time', 'createdAt');
          }
        }
      },
    });
  }
  return dbPromise;
}

export interface Memory {
  id: string;
  soulId: string;
  /** LLM 生成的摘要（自然语言） */
  summary: string;
  /** 来源消息 ID 列表（用于调试） */
  sourceMessageIds: string[];
  createdAt: number;
}

function newId(): string {
  return crypto.randomUUID();
}

export const memoryRepo = {
  async add(input: Omit<Memory, 'id' | 'createdAt'>): Promise<Memory> {
    const db = await getDB();
    const memory: Memory = {
      ...input,
      id: newId(),
      createdAt: Date.now(),
    };
    await db.put(STORE, memory);
    return memory;
  },

  /** 取一个 soul 的最近 N 条记忆（按时间倒序） */
  async getRecent(soulId: string, limit = 5): Promise<Memory[]> {
    const db = await getDB();
    const tx = db.transaction(STORE, 'readonly');
    const idx = tx.store.index('by_soul');
    const all = await idx.getAll(soulId);
    await tx.done;
    return all
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  },

  async getAll(soulId: string): Promise<Memory[]> {
    const db = await getDB();
    const tx = db.transaction(STORE, 'readonly');
    const idx = tx.store.index('by_soul');
    const all = await idx.getAll(soulId);
    await tx.done;
    return all.sort((a, b) => b.createdAt - a.createdAt);
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(STORE, id);
  },

  async clear(soulId: string): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(STORE, 'readwrite');
    const idx = tx.store.index('by_soul');
    let cursor = await idx.openCursor(IDBKeyRange.only(soulId));
    while (cursor) {
      await cursor.delete();
      cursor = await cursor.continue();
    }
    await tx.done;
  },
};
