/**
 * 场景区域配置（Sprint #18 · M18-001）
 *
 * 3 个区域：客厅 / 咖啡馆 / 公园
 * 每个区域有自己的位置中心 + 装饰特征
 */
export type ZoneType = 'living' | 'cafe' | 'park';

export interface ZoneConfig {
  type: ZoneType;
  name: string;
  emoji: string;
  center: [number, number];  // 区域中心 (x, z)
  radius: number;             // 区域半径
  floorColor: string;         // 地板颜色
  accent: string;             // 装饰色
}

export const ZONES: Record<ZoneType, ZoneConfig> = {
  living: {
    type: 'living',
    name: '客厅',
    emoji: '🛋️',
    center: [-3, -2],
    radius: 2.5,
    floorColor: '#7c2d12',    // 棕色木地板
    accent: '#fbbf24',       // 金色装饰
  },
  cafe: {
    type: 'cafe',
    name: '咖啡馆',
    emoji: '☕',
    center: [0, 0],
    radius: 2.5,
    floorColor: '#1e293b',    // 深灰水泥
    accent: '#92400e',       // 咖啡棕
  },
  park: {
    type: 'park',
    name: '公园',
    emoji: '🌳',
    center: [3, 2],
    radius: 2.5,
    floorColor: '#14532d',    // 深绿草地
    accent: '#86efac',       // 浅绿
  },
};

/** 根据角色关系类型自动分配区域（简单规则） */
export function assignZoneForRelationship(relationshipType: string): ZoneType {
  const map: Record<string, ZoneType> = {
    girlfriend: 'living',  // 女友在客厅
    boyfriend: 'living',
    child: 'park',         // 小孩在公园
    pet: 'park',
    mentor: 'cafe',        // 导师在咖啡馆
    friend: 'cafe',
    sibling: 'living',
    custom: 'cafe',
  };
  return map[relationshipType] ?? 'cafe';
}
