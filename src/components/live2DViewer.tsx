"use client";

import { useRef, useEffect } from "react";
import type { Live2DModel as Live2DModelType } from "pixi-live2d-display-lipsyncpatch";
import * as PIXI from "pixi.js";

export default function Live2DViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<Live2DModelType | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    (window as any).PIXI = PIXI;

    const app = new PIXI.Application({
      view: canvasRef.current,
      resizeTo: window,
      backgroundAlpha: 0,
    });

    (async () => {
      try {
        const { Live2DModel } = await import(
          "pixi-live2d-display-lipsyncpatch"
        );

        const model = await Live2DModel.from("ANIYA/ANIYA.model3.json", {
          autoInteract: false,
        });

        app.stage.addChild(model);

        modelRef.current = model;

        const recalc = () => {
          const w = app.renderer.width;
          const h = app.renderer.height;
          const base = Math.min(w, h);
          const scale = base / 4096;
          model.scale.set(scale, scale);
          model.anchor.set(0.5, 0.5);
          model.x = w / 2;
          model.y = h * 0.9; // 캔버스 하단에 배치
        };

        recalc();
        window.addEventListener("resize", recalc);

        // 3) 얼굴 중심 좌표 계산 (모델 바운딩 기준으로 약간 위쪽)
        const bounds = model.getBounds();
        const faceCenter = {
          x: bounds.x + bounds.width * 0.5,
          y: bounds.y + bounds.height * 0.25, // 얼굴 대충 상단 25% 지점
        };

        // 4) 포인터 무브 이벤트로 직접 포커싱
        window.addEventListener("pointermove", (e) => {
          if (!modelRef.current || !canvasRef.current) return;
          // 화면 대비 상대 좌표 (-1 ~ +1)
          const dx = ((e.clientX - faceCenter.x) / app.renderer.width) * 2;
          const dy = -((e.clientY - faceCenter.y) / app.renderer.height) * 2;

          // 머리 회전 파라미터(ParamAngleX/Y)
          model.internalModel.coreModel.setParameterValueById(
            "ParamAngleX",
            dx * 30
          );
          model.internalModel.coreModel.setParameterValueById(
            "ParamAngleY",
            dy * 30
          );

          // 눈동자 파라미터(ParamEyeBallX/Y)
          model.internalModel.coreModel.setParameterValueById(
            "ParamEyeBallX",
            dx
          );
          model.internalModel.coreModel.setParameterValueById(
            "ParamEyeBallY",
            dy
          );
        });

        const exprSettings = model.internalModel.settings;
        console.log("Expression definitions:", exprSettings);
      } catch (err) {
        console.error("Failed to load Live2D model", err);
      }
    })();

    return () => {
      app.destroy(true, { children: true });
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        onClick={() => {
          //   modelRef.current?.speak("/paimon03.wav");
          modelRef.current?.expression();
        }}
        className="w-full h-full cursor-pointer -z-10 cursor-pointer"
        style={{
          backgroundImage: "url('/background2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </>
  );
}
