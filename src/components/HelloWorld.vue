<template>
  <div
    id="pantone"
    class="chand show-pantone"
  >
    <color-card
      v-for="(_, idx) in cards"
      :id="`items${idx}`"
      :style="calcStyle(idx)"
      class="items"
    >
    </color-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useWindowSize } from "@vueuse/core";
import useMouseDelta from "@/hooks/useMouseDelta";
import ColorCard from "./ColorCard.vue";

const color = ["#f07c82", "#74759b"];
const colorNum = 26;
const radius = 500;
const speed = 0.05;
const acceleration = 0.05;

const INERTIA_TIME = 1000;
const INERTIA_DISTANCE = 15;

const cards = ref<number[]>(Array.from({ length: colorNum }, (_, i) => (360 / colorNum) * i));
const moveTime = ref<number>(0);
const isMoving = ref<boolean>(false);
const moveRecords = ref<{ position: number; time: number }[]>([]);

const { width, height } = useWindowSize();

const oPoint = {
  x: width.value / 2 - 110,
  y: height.value,
};

const calcStyle = (idx: number): string => {
  const angle = isMoving.value ? cards.value[idx] + deltaX.value * speed : cards.value[idx];
  const x = oPoint.x + Math.sin((Math.PI * angle) / 180) * radius;
  const y = oPoint.y - Math.cos((Math.PI * angle) / 180) * radius;

  const translate3d = `translate3d(${x}px, ${y}px, 0px)`;
  const cardRotate = `rotate(${angle}deg)`;
  const scale = `scale(${Math.log(10 + (10 * (radius + Math.cos((Math.PI * angle) / 180) * radius)) / (2 * radius)) / Math.log(10)})`;

  const transform = `transform:${translate3d} ${cardRotate} ${scale}`;
  const backgroudColor = `background-color: ${color[idx % 2]}`;
  const zIndex = `z-index: ${Math.ceil(height.value) - Math.ceil(y)}`;

  return `${transform}; ${backgroudColor}; ${zIndex}`;
};

const setInertialMotion = () => {
  const begin = moveRecords.value[0];
  const end = moveRecords.value[moveRecords.value.length - 1];
  let velocity = (end.position - begin.position) / (end.time - begin.time);
  const direction = velocity >= 0 ? 1 : -1;

  const move = () => {
    velocity = Math.abs(velocity) - acceleration > 0 ? velocity - direction * acceleration : 0;
    cards.value.forEach((_, idx) => (cards.value[idx] = cards.value[idx] + velocity));
    requestAnimationFrame(() => {
      if (Math.abs(velocity) > 0.0005) {
        move();
      } else {
        isMoving.value = false;
        moveTime.value = 0;
        moveRecords.value = [];
      }
    });
  };
  move();
};

const onMoveEnd = () => {
  cards.value.forEach((_, idx) => (cards.value[idx] = cards.value[idx] + deltaX.value * speed));
  isMoving.value = false;
  if (deltaT.value <= INERTIA_TIME && Math.abs(deltaX.value) > INERTIA_DISTANCE) {
    setInertialMotion();
  }
};

const onMoveStart = () => {
  moveTime.value = 0;
  isMoving.value = true;
};

const onMoving = (e: MouseEvent) => {
  moveRecords.value.push({ position: e.clientX, time: Date.now() });
  if (moveRecords.value.length > 5) moveRecords.value.shift();
};

const { deltaX, deltaT } = useMouseDelta({
  onMoveStart,
  onMoveEnd,
  onMoving,
});
</script>

<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}

#pantone {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 10;
}

.chand {
  cursor: pointer;
}

.show-pantone {
  opacity: 1 !important;
  transition: opacity 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19);
  -moz-transition: opacity 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19);
  -webkit-transition: opacity 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19);
  -o-transition: opacity 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.items {
  display: block;
  width: 220px;
  height: 310px;
  position: absolute;
}
</style>
