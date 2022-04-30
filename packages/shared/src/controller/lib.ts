import { KeyObject } from 'crypto';
import type { Base } from '../model/libs';

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type OptionalBase<T extends Base> = Optional<T, keyof Base>;
