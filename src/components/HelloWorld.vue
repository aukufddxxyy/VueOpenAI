<template>
  <div id="pantone" class="chand show-pantone">
    <color-card v-for="_, idx in cards" :id="`items${idx}`" :style="calcStyle(idx)" class="items">
    </color-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useWindowSize } from '@vueuse/core';
import useMouseDelta from '@/hooks/useMouseDelta';
import ColorCard from './ColorCard.vue';

const color = ['#f07c82', '#74759b']
const colorNum = 26
const radius = 500
const speed = 0.05

// 触发惯性滑动条件:
// 在手指离开屏幕时，如果和上一次 move 时的间隔小于 `MOMENTUM_TIME` 且 move
// 距离大于 `MOMENTUM_DISTANCE` 时，执行惯性滑动
const INERTIA_TIME = 1000
const INERTIA_DISTANCE = 15

// let interval: number = 0

const cards = ref<number[]>(Array.from({ length: colorNum }, (_, i) => 360 / colorNum * i))
const moveTime = ref<number>(0)

const { width, height } = useWindowSize()
const { deltaX, deltaY, deltaT, pressed } = useMouseDelta()

const oPoint = {
  x: width.value / 2 - 110,
  y: height.value
}

const calcStyle = (idx: number): string => {
  const angle = pressed.value ? cards.value[idx] + deltaX.value * speed : cards.value[idx]
  const x = oPoint.x + Math.sin(Math.PI * angle / 180) * radius
  const y = oPoint.y - Math.cos(Math.PI * angle / 180) * radius

  const translate3d = `translate3d(${x}px, ${y}px, 0px)`
  const cardRotate = `rotate(${angle}deg)`
  const scale = `scale(${Math.log(10 + 10 * (radius + Math.cos(Math.PI * angle / 180) * radius) / (2 * radius)) / Math.log(10)})`

  const transition = `transition: all ${moveTime.value}ms cubic-bezier(0.17, 0.89, 0.45, 1)`
  const transform = `transform:${translate3d} ${cardRotate} ${scale}`
  const backgroudColor = `background-color: ${color[idx % 2]}`
  const zIndex = `z-index: ${Math.ceil(height.value) - Math.ceil(y)}`

  return `${transition}; ${transform}; ${backgroudColor}; ${zIndex}`
}

const momentum = (): number => {
  // 惯性滚动的速度
  const inertia_speed = Math.abs(deltaX.value / deltaT.value)
  // 惯性滚动的距离
  let nDistance = (inertia_speed / 0.01) * (deltaX.value < 0 ? -1 : 1)
  return nDistance
}

const setMove = (distance: number) => {
  // let dX = distance / deltaT.value
  // let interval = setInterval(
  //   () => cards.value.forEach((_, idx) => cards.value[idx] = (cards.value[idx] + dX)),
  //   1
  // )
  // setTimeout(() => { moveTime.value = deltaT.value * 20; clearInterval(interval) }, deltaT.value * 2)
  moveTime.value = deltaT.value * 10
  cards.value.forEach((_, idx) => cards.value[idx] = (cards.value[idx] + distance))
}

const onMoveEnd = () => {
  cards.value.forEach((_, idx) => cards.value[idx] = (cards.value[idx] + deltaX.value * speed))
  if (deltaT.value <= INERTIA_TIME && Math.abs(deltaX.value) > INERTIA_DISTANCE) {
    const distance = momentum()
    setMove(distance)
  }
}

const onMoveStart = () => {
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

.items {
  display: block;
  width: 220px;
  height: 310px;
  position: absolute;
}
</style>
