<template>
  <div
    id="pantone"
    class="chand show-pantone"
  >
    <color-card
      v-for="(angle, idx) in card_angles"
      :id="`items${idx}`"
      :num="idx"
      :angle="angle"
    >
    </color-card>
  </div>
</template>

<script setup lang="ts">
import { provide, reactive, ref } from "vue";
import { useWindowSize } from "@vueuse/core";
import useMouseDelta from "@/hooks/useMouseDelta";
import ColorCard from "./ColorCard.vue";
import { speed, CARD_GROUP_CTX_KEY } from "./constants";

const colorNum = 26;
const acceleration = 0.05;

const INERTIA_TIME = 1000;
const INERTIA_DISTANCE = 15;

const card_angles = ref<number[]>(Array.from({ length: colorNum }, (_, i) => (360 / colorNum) * i));
const moveTime = ref<number>(0);
const isMoving = ref<boolean>(false);
const samples = ref<{ position: number; time: number }[]>([]);

const { width, height } = useWindowSize();

const setInertialMotion = () => {
  const begin = samples.value[0];
  const end = samples.value[samples.value.length - 1];
  let velocity = (end.position - begin.position) / (end.time - begin.time);
  const direction = velocity >= 0 ? 1 : -1;

  const move = () => {
    velocity = Math.abs(velocity) - acceleration > 0 ? velocity - direction * acceleration : 0;
    card_angles.value.forEach((_, idx) => (card_angles.value[idx] = card_angles.value[idx] + velocity));
    requestAnimationFrame(() => {
      if (Math.abs(velocity) > 0.0005) {
        move();
      } else {
        isMoving.value = false;
        moveTime.value = 0;
        samples.value = [];
      }
    });
  };
  move();
};

const onMoveEnd = () => {
  card_angles.value.forEach((_, idx) => (card_angles.value[idx] = card_angles.value[idx] + deltaX.value * speed));
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
  samples.value.push({ position: e.clientX, time: Date.now() });
  if (samples.value.length > 5) samples.value.shift();
};

const { deltaX, deltaT } = useMouseDelta({
  onMoveStart,
  onMoveEnd,
  onMoving,
});

provide(
  CARD_GROUP_CTX_KEY,
  reactive({
    isMoving,
    deltaX,
    height,
    width,
  })
);
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
  transform-style: preserve-3d;
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
</style>
