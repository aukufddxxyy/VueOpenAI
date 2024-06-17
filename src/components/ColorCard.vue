<template>
  <div
    class="color-card"
    :style="{
      backgroundColor,
      transform,
    }"
  />
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { color, radius, speed, CARD_GROUP_CTX_KEY } from "./constants";

interface Props {
  num: number;
  angle: number;
}

const props = defineProps<Props>();
const ctx = inject(CARD_GROUP_CTX_KEY, void 0);

const oPoint = {
  x: (ctx?.width || 0) / 2 - 110,
  y: ctx?.height || 0,
};

const backgroundColor = computed(() => color[props.num % 2]);
const transform = computed(() => {
  const angle = ctx?.isMoving ? props.angle + ctx?.deltaX * speed : props.angle;
  const x = oPoint.x + Math.sin((Math.PI * angle) / 180) * radius;
  const y = oPoint.y - Math.cos((Math.PI * angle) / 180) * radius;

  const translate3d = `translate3d(${x}px, ${y}px, ${Math.ceil(ctx?.height || 0) - Math.ceil(y)}px)`;
  const cardRotate = `rotate(${angle}deg)`;
  const scale = `scale(${Math.log(10 + (10 * (radius + Math.cos((Math.PI * angle) / 180) * radius)) / (2 * radius)) / Math.log(10)})`;

  return `${translate3d} ${cardRotate} ${scale}`;
});
</script>

<style lang="scss" scoped>
.color-card {
  display: block;
  width: 220px;
  height: 310px;
  position: absolute;
}
</style>
