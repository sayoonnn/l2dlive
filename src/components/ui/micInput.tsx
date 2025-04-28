import React from "react";
import IconButton from "./iconButton";

export default function MicInput({
  isRecording,
  startRecognition,
  stopRecognition,
}: {
  isRecording: boolean;
  startRecognition: () => void;
  stopRecognition: () => void;
}) {
  return (
    <div className="w-full flex justify-center my-10">
      {isRecording ? (
        <div className="relative flex contents-center justify-center">
          <div className="absolute animate-ripple m-5 rounded-full border border-red-300 h-[33px] w-[33px] z-10" />
          <IconButton
            clickEvent={() => stopRecognition()}
            className="text-white bg-red-500 active:bg-red-600 z-11"
            type="mic"
          />
        </div>
      ) : (
        <IconButton
          clickEvent={() => startRecognition()}
          className="text-[rgba(255,255,255,.7)] bg-button-default active:bg-button-active active:text-[rgba(255,255,255,.8)]"
          type="mic"
        />
      )}
    </div>
  );
}
