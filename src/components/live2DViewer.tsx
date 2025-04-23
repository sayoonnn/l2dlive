import { useRef, useEffect } from "react";
import { Live2DModel } from "pixi-live2d-display-lipsyncpatch";
import useChatResponse from "@/hooks/useChatResponse";
import * as PIXI from "pixi.js";

(window as any).PIXI = PIXI;

const setModelLocation = (model: Live2DModel, app: PIXI.Application) => {
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
};

const setModelMouseTracking = (model: Live2DModel, app: PIXI.Application) => {
  // 얼굴 중심 좌표 계산 (모델 바운딩 기준으로 약간 위쪽)
  const bounds = model.getBounds();
  const faceCenter = {
    x: bounds.x + bounds.width * 0.5,
    y: bounds.y + bounds.height * 0.25, // 얼굴 대충 상단 25% 지점
  };

  // 포인터 무브 이벤트로 직접 포커싱
  window.addEventListener("pointermove", (e) => {
    // 화면 대비 상대 좌표 (-1 ~ +1)
    const dx = ((e.clientX - faceCenter.x) / app.renderer.width) * 2;
    const dy = -((e.clientY - faceCenter.y) / app.renderer.height) * 2;

    // 머리 회전 파라미터(ParamAngleX/Y)
    model.internalModel.coreModel.setParameterValueById("ParamAngleX", dx * 30);
    model.internalModel.coreModel.setParameterValueById("ParamAngleY", dy * 30);

    // 눈동자 파라미터(ParamEyeBallX/Y)
    model.internalModel.coreModel.setParameterValueById("ParamEyeBallX", dx);
    model.internalModel.coreModel.setParameterValueById("ParamEyeBallY", dy);
  });
};

export default function Live2DViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<Live2DModel | null>(null);

  useEffect(() => {
    const app = new PIXI.Application({
      view: canvasRef.current!,
      resizeTo: window,
      backgroundAlpha: 0,
    });

    (async () => {
      const model = await Live2DModel.from("/ANIYA/ANIYA.model3.json", {
        autoFocus: false,
      });

      modelRef.current = model;

      app.stage.addChild(model);
      setModelLocation(model, app);
      setModelMouseTracking(model, app);
    })();
  }, []);

  useChatResponse(modelRef);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer -z-10"
      style={{
        backgroundImage: "url('/background2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={async () => {
        try {
          const response = await fetch("http://183.101.161.244:8000/start", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: "안녕하세요 나는 아냐! 반가워요. 조금 긴 문장. 어떻게 진행될까요.",
            }),
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }}
    />
  );
}
