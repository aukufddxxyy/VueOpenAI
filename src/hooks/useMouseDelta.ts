import { ref, watch } from "vue";
import type { Ref } from "vue";
import { useEventListener, useMouse, useMousePressed } from "@vueuse/core";

interface MouseDelta {
  (options: { onMoveStart?: (e: MouseEvent) => void; onMoving?: (e: MouseEvent) => void; onMoveEnd?: (e?: MouseEvent) => void }): {
    deltaX: Ref<number>;
    deltaY: Ref<number>;
    deltaT: Ref<number>;
  };
}

const useMouseDelta: MouseDelta = ({ onMoveStart, onMoving, onMoveEnd }) => {
  const startTime = ref<number>(0);
  const deltaX = ref<number>(0);
  const deltaY = ref<number>(0);
  const deltaT = ref<number>(0);
  const initPos = ref<{ x: number; y: number }>({ x: 0, y: 0 });
  let clearMove: null | Function = null;
  let clearEnd: null | Function = null;

  const moveStart = (e: MouseEvent) => {
    deltaX.value = 0;
    deltaY.value = 0;
    initPos.value = { x: e.clientX, y: e.clientY };
    startTime.value = Date.now();
    onMoveStart && onMoveStart(e);
    clearMove = useEventListener(document, "mousemove", onMove);
    clearEnd = useEventListener(document, "mouseup", moveEnd);
  };

  const onMove = (e: MouseEvent) => {
    deltaX.value = e.clientX - initPos.value.x;
    deltaY.value = e.clientY - initPos.value.y;
    onMoving && onMoving(e);
  };

  const moveEnd = (e: MouseEvent) => {
    deltaT.value = Date.now() - startTime.value;
    clearMove && clearMove();
    clearEnd && clearEnd();
    onMoveEnd && onMoveEnd(e);
  };

  useEventListener(document, "mousedown", moveStart);

  return { deltaX, deltaY, deltaT };
};

export default useMouseDelta;
