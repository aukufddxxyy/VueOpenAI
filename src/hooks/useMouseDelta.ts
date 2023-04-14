import { ref } from "vue";
import { useEventListener, useMouse, useMousePressed } from "@vueuse/core";

const useMouseDelta = () => {

    const startTime = ref<number>(0)
    const deltaX = ref<number>(0)
    const deltaY = ref<number>(0)
    const deltaT = ref<number>(0)
    const initPos = ref<{ x: number, y: number }>({ x: 0, y: 0 })
    const { pressed } = useMousePressed()

    const moveStart = (e: MouseEvent) => {
        deltaX.value = 0
        deltaY.value = 0
        initPos.value = { x: e.clientX, y: e.clientY }
        startTime.value = Date.now()
    }

    const onMove = (e: MouseEvent) => {
        deltaX.value = e.clientX - initPos.value.x
        deltaY.value = e.clientY - initPos.value.y
    }

    const moveEnd = (e?: MouseEvent) => {
        deltaT.value = Date.now() - startTime.value
    }

    useEventListener(document, 'mousedown', (e) => moveStart(e))
    useEventListener(document, 'mousemove', (e) => { if (pressed.value) onMove(e); })
    useEventListener(document, 'mouseup', (e) => moveEnd(e))

    return { deltaX, deltaY, deltaT, pressed }
}

export default useMouseDelta