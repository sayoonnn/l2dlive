import { useRef, useEffect } from "react";
import { Live2DModel } from "pixi-live2d-display-lipsyncpatch";
import * as PIXI from "pixi.js";
(window as any).PIXI = PIXI;

export default function Live2DViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<Live2DModel>(null);
  const appRef = useRef<PIXI.Application>(null);

  useEffect(() => {
    const app = new (PIXI.Application as any)({
      view: canvasRef.current!,
      resizeTo: window,
      backgroundAlpha: 0,
    });
    app.ticker.maxFPS = 60;
    appRef.current = app;

    let offMouse: () => void;
    let offResize: () => void;

    Live2DModel.from("/runtime/kei_vowels_pro.model3.json", {
      autoFocus: false,
    }).then((model) => {
      modelRef.current = model;
      app.stage.addChild(model);

      const recalc = () => {
        const w = app.renderer.width;
        const h = app.renderer.height;
        model.scale.set(1, 1);
        model.anchor.set(0.5, 0.5);
        model.x = w / 2;
        model.y = h / 2;
      };
      recalc();

      app.renderer.on("resize", recalc);
      offResize = () => app.renderer.off("resize", recalc);

      const onPointer = (e: PointerEvent) => {
        const b = model.getBounds();
        const cx = b.x + b.width * 0.5;
        const cy = b.y + b.height * 0.25;
        const dx = ((e.clientX - cx) / app.renderer.width) * 2;
        const dy = -((e.clientY - cy) / app.renderer.height) * 2;
        const core = model.internalModel.coreModel as any;
        core.setParameterValueById("ParamAngleX", dx * 30);
        core.setParameterValueById("ParamAngleY", dy * 30);
        core.setParameterValueById("ParamEyeBallX", dx);
        core.setParameterValueById("ParamEyeBallY", dy);
      };

      window.addEventListener("pointermove", onPointer);
      offMouse = () => window.removeEventListener("pointermove", onPointer);
    });

    return () => {
      offMouse?.();
      offResize?.();
      app.destroy(true, { children: true });
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer -z-10 bg-size-cover bg-center bg-stone-900"
    />
  );
}
