import { ref } from "vue";
import { useEventListener, useMouse, useMousePressed } from "@vueuse/core";

const useMouseDelta = () => {

    const deltaX = ref<number>(0)
    const deltaY = ref<number>(0)
    const initPos = ref<{ x: number, y: number }>({ x: 0, y: 0 })
    const { pressed } = useMousePressed()

    useEventListener(document, 'mousedown', (e) => initPos.value = { x: e.clientX, y: e.clientY })
    useEventListener(document, 'mousemove', (e) => {
        if (!pressed.value) return;
        deltaX.value = e.clientX - initPos.value.x
        deltaY.value = e.clientY - initPos.value.y
    })

    return {deltaX, deltaY}
}

export default useMouseDelta