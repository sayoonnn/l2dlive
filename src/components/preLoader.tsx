"use client";

import { useEffect } from "react";
import Script from "next/script";
import * as PIXI from "pixi.js";

export default function PreLoader() {
  useEffect(() => {
    (window as any).PIXI = PIXI;
  }, []);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/pixi-live2d-display-lipsyncpatch@0.5.0-ls-7/dist/cubism2.min.js"
        strategy="beforeInteractive"
      />
    </>
  );
}
