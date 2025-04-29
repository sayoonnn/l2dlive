import { useState } from "react";

export default function ApiKeyInput({
  apiKey,
  setApiKey,
}: {
  apiKey: string;
  setApiKey: (key: string) => void;
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <>
      <div className="text-stone-50 my-2">
        대화를 위해서&nbsp;
        <span className="text-pink-400 underline underline-offset-3 hover:text-pink-300 active:text-pink-200">
          <a href="https://aistudio.google.com/apikey" target="_blank">
            Gemini API Key
          </a>
        </span>
        &nbsp;가 필요합니다.
      </div>

      <div className="relative">
        <input
          type={isPasswordVisible ? "text" : "password"}
          className={`w-full h-10 bg-transparent text-gray-50 px-1 border-b-2 focus:outline-none ${
            !apiKey ? "border-red-500" : "border-stone-50"
          }`}
          placeholder="API 키를 넣어주세요"
          onChange={(e) => {
            setTimeout;
            setApiKey(e.target.value);
          }}
          value={apiKey}
        />

        {apiKey === "" && (
          <p className="absolute -bottom-7 text-red-500 text-sm">
            API 키를 입력해주세요.
          </p>
        )}

        <button
          className="absolute right-0 bottom-0 z-10"
          onClick={() => setIsPasswordVisible((prev) => !prev)}
        >
          <span className="material-symbols-rounded text-stone-50 !text-base cursor-pointer">
            {isPasswordVisible ? "visibility_off" : "visibility"}
          </span>
        </button>
        <button
          className="absolute right-6 bottom-0 z-10"
          onClick={(e) => setApiKey("")}
        >
          <span className="material-symbols-rounded text-stone-50 !text-base cursor-pointer">
            cancel
          </span>
        </button>
      </div>
    </>
  );
}
