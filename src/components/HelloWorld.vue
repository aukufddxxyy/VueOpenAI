<template>
  <div id="pantone" class="chand show-pantone" >
    <color-card v-for="_, idx in cards" :id="`items${idx}`" :style="calcStyle(idx)" :key="idx" class="card">
    </color-card>
    <div style="width: 1px;height: 100%;position: absolute;top: 0;left: 50%;background-color: red;"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useWindowSize } from '@vueuse/core';
import useMouseDelta from '@/hooks/useMouseDelta';
import ColorCard from './ColorCard.vue';

const color = ['#f07c82', '#74759b']
const colorNum = 56
const radius = 2000
const speed = 0.05
const acceleration = 0.005
let interval: number

const INERTIA_TIME = 1000
const INERTIA_DISTANCE = 15

const cards = ref<number[]>(Array.from({ length: colorNum }, (_, i) => 360 / colorNum * i))
const moveTime = ref<number>(0)

const { width, height } = useWindowSize()
const { deltaX, deltaY, deltaT, pressed } = useMouseDelta()
const cardTheme = {width:220,height:320}
console.log(width.value,height.value)
const oPoint = {
  x: width.value/2 - cardTheme.width/2 ,
  y: height.value * 1.1
}

const calcStyle = (idx: number): string => {
  const angle = pressed.value ? cards.value[idx] + deltaX.value * speed : cards.value[idx]
  const x = oPoint.x + Math.sin(Math.PI * angle / 180) * radius
  const y = oPoint.y - Math.cos(Math.PI * angle / 180) * radius  
  const s1 = Math.log(15 + 10 * (radius + Math.cos(Math.PI * angle / 180) * radius ) / radius) / Math.log(15) 
  const s = (0.2 * Math.exp(7 * (s1-1) ))+ 0.9*s1
  // console.log(s) 
  console.log(s1)
  const translate3d = `translate3d(${x / s}px, ${y / s}px, 0px)`
  const cardRotate = `rotate(${angle}deg)`
  const scale = `scale(${s})`

  const transform = `transform:${scale} ${translate3d} ${cardRotate}`
  const backgroudColor = `background-color: ${color[idx % 2]}`
  const zIndex = `z-index: ${Math.ceil(height.value) - Math.ceil(y)}`
  return `${transform}; ${backgroudColor}; ${zIndex}`


}

const setMove = () => {
  let velocity = deltaX.value * 0.5 / deltaT.value

  interval = setInterval(
    () => {
      velocity = Math.abs(velocity - acceleration) > 0 ? velocity - (velocity / Math.abs(velocity)) * acceleration : 0;
      cards.value.forEach((_, idx) => cards.value[idx] = (cards.value[idx] + velocity))
      if (velocity < 0.0005) clearInterval(interval)
    },
    1
  )
}

const onMoveEnd = () => {
  cards.value.forEach((_, idx) => cards.value[idx] = (cards.value[idx] + deltaX.value * speed))
  if (deltaT.value <= INERTIA_TIME && Math.abs(deltaX.value) > INERTIA_DISTANCE) {
    setMove()
  }
}

const onMoveStart = () => {
  clearInterval(interval)
  moveTime.value = 0
}

watch(pressed, (newVal, oldVal) => {
  // if (newVal || !oldVal) return;
  if (newVal && !oldVal) onMoveStart()
  if (!newVal && oldVal) onMoveEnd()
})
 

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

.card {
  display: block;
  width:  v-bind("cardTheme.width+'px'");
  height: v-bind("cardTheme.height+'px'");
  position: absolute;
  box-sizing: border-box;
}

</style>
