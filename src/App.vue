<template>
  <div
    id="container"
    :style="containerStyle"
  >
    <HelloWorld msg="Vite + Vue" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import HelloWorld from "@/components/HelloWorld.vue";
import { useWindowSize } from "@vueuse/core";

const { width, height } = useWindowSize();

const containerStyle = computed(() => `width: ${width.value}px; height: ${height.value}px; `);
</script>

<style lang="scss" scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

#container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;
  transform-origin: 0 0;
  transform: translate(0px, 0px) scale(1.04292);
}
</style>
