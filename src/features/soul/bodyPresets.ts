/**
 * 角色身体预设（Sprint #16 · M16-002 配套）
 *
 * 按关系类型 + 性别提供捏脸参数（身高 / 体型）默认值
 */
import type { BodyParams } from '@/stores/souls';

export const FEMALE_BODY: BodyParams = { height: 1.0, bodyType: 0.9 };
export const MALE_BODY: BodyParams = { height: 1.15, bodyType: 1.05 };
export const CHILD_BODY: BodyParams = { height: 0.6, bodyType: 0.7 };
export const PET_BODY: BodyParams = { height: 0.4, bodyType: 0.8 };
