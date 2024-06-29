import type { InjectionKey } from "vue";

interface CardGroupContext {
  isMoving: boolean;
  deltaX: number;
  height: number;
  width: number;
  velocity: number;
}

export const color = ["#f07c82", "#74759b"] as const;
export const radius = 500;
export const speed = 0.05;
export const CARD_GROUP_CTX_KEY: InjectionKey<CardGroupContext> = Symbol("CARD_GROUP_CTX_KEY");
