<template>
  <div id="pantone" class="chand show-pantone">
    <color-card v-for="color, idx in colors" :backgroudColor="color" :cardId="idx" :id="`items${idx}`"
      :style="calcStyle(idx)" class="items">
    </color-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useWindowSize, useEventListener } from '@vueuse/core';
import useMouseDelta from '@/hooks/useMouseDelta';
import ColorCard from './ColorCard.vue';

defineProps<{ msg: string }>()

const state = reactive({
  positions: []
})

const { width, height } = useWindowSize()
const { deltaX, deltaY } = useMouseDelta()


const color = ['#f07c82', '#74759b']
const colorNum = 26
const radius = 800
const speed = 0.05
const oPoint = {
  x: width.value / 2 - 110,
  y: height.value
}

const colors = Array.from({ length: colorNum }, (v, i) => color[i % 2])

const calcStyle = (idx: number): string => {
  const angle = (360 / colorNum * idx + (deltaX.value) * speed) % 360
  const x = oPoint.x + Math.sin(Math.PI * angle / 180) * radius
  const y = oPoint.y - Math.cos(Math.PI * angle / 180) * radius

  const translate3d = `translate3d(${x}px, ${y}px, 0px)`
  const cardRotate = `rotate(${angle}deg)`
  const scale = `scale(${Math.log(10 + 10 * (radius + Math.cos(Math.PI * angle / 180) * radius) / (2 * radius)) / Math.log(10)})`

  const transform = `transform:${translate3d} ${cardRotate} ${scale}`
  const backgroudColor = `background-color: ${colors[idx]}`
  const zIndex = `z-index: ${Math.ceil(height.value) - Math.ceil(y)}`
  
  return `${transform}; ${backgroudColor}; ${zIndex}`
}

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
  transition: opacity .5s cubic-bezier(.55, .055, .675, .19);
  -moz-transition: opacity .5s cubic-bezier(.55, .055, .675, .19);
  -webkit-transition: opacity .5s cubic-bezier(.55, .055, .675, .19);
  -o-transition: opacity .5s cubic-bezier(.55, .055, .675, .19);
}

.items {
  display: block;
  width: 220px;
  height: 310px;
  position: absolute;
}
</style>
