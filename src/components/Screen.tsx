import React, { useEffect, useRef } from "react";
import { Textfit } from "react-textfit";

interface ScreenProps {
  value: string;
  operation: string;
  signops: string;
  isBlinking: boolean;
}

const usePointerScroll = (ref: React.RefObject<HTMLElement>) => {
  const isDrag = useRef(false);

  const dragStart = () => {
    isDrag.current = true;
  };

  const dragEnd = () => {
    isDrag.current = false;
  };

  const drag = (ev: PointerEvent) => {
    if (isDrag.current && ref.current) {
      ref.current.scrollLeft -= ev.movementX;
    }
  };

  useEffect(() => {
    const elem = ref.current;

    if (elem) {
      elem.addEventListener("pointerdown", dragStart);
      document.addEventListener("pointerup", dragEnd);
      document.addEventListener("pointermove", drag);

      return () => {
        elem.removeEventListener("pointerdown", dragStart);
        document.removeEventListener("pointerup", dragEnd);
        document.removeEventListener("pointermove", drag);
      };
    }
  }, [ref, dragStart, dragEnd, drag]);
};

const Screen: React.FC<ScreenProps> = ({
  value,
  operation,
  signops,
  isBlinking,
}) => {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  usePointerScroll(paragraphRef);

  return (
    <section className="w-full h-auto">
      <Textfit className="screenTextWrapper" mode="single" max={65}>
        <div className="no-scrollbar absolute top-0 mt-2 left-0 text-2xl w-[100%] pl-2 mobile:pl-1 pr-1 overflow-x-auto">
          {signops}
        </div>
        <div
          ref={paragraphRef}
          className="no-scrollbar absolute top-0 mt-2 left-0 text-2xl w-[100%] pl-2 mobile:pl-1 pr-1 overflow-x-auto cursor-grab select-none"
        >
          {operation}
        </div>
        <span className={isBlinking ? "blinking" : ""}>{value}</span>
      </Textfit>
    </section>
  );
};

export default Screen;
