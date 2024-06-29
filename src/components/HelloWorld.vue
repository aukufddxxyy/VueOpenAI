<template>
  <div id="pantone" class="chand show-pantone">
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

const colorNum = 10;
const acceleration = 0.05;

const INERTIA_TIME = 1000;
const INERTIA_DISTANCE = 15;

const card_angles = ref<number[]>(
  Array.from({ length: colorNum }, (_, i) => (360 / colorNum) * i)
);
const moveTime = ref<number>(0);
const isMoving = ref<boolean>(false);
const samples = ref<{ position: number; time: number }[]>([]);
const velocity = ref<number>(0);

const { width, height } = useWindowSize();

const setInertialMotion = () => {
  const begin = samples.value[0];
  const end = samples.value[samples.value.length - 1];
  velocity.value = (end.position - begin.position) / (end.time - begin.time);

  const direction = velocity.value >= 0 ? 1 : -1;

  const move = () => {
    velocity.value =
      Math.abs(velocity.value) - acceleration > 0
        ? velocity.value - direction * acceleration
        : 0;

    card_angles.value.forEach(
      (_, idx) =>
        (card_angles.value[idx] = card_angles.value[idx] + velocity.value)
    );
    requestAnimationFrame(() => {
      if (Math.abs(velocity.value) > 0.0005) {
        move();
      } else {
        isMoving.value = false;
        moveTime.value = 0;
        samples.value = [];
        velocity.value = 0;
      }
    });
  };
  move();
};

const onMoveEnd = () => {
  card_angles.value.forEach(
    (_, idx) =>
      (card_angles.value[idx] = card_angles.value[idx] + deltaX.value * speed)
  );
  isMoving.value = false;
  if (
    deltaT.value <= INERTIA_TIME &&
    Math.abs(deltaX.value) > INERTIA_DISTANCE
  ) {
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
    velocity,
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
