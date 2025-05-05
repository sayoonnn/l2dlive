import { useState, useEffect } from "react";
import { useSettingContext } from "@/contexts/settingContext";

export default function InstructionEditor() {
  const { options, setOptions } = useSettingContext();
  const [text, setText] = useState(options.instruction);

  useEffect(() => {
    const handler = setTimeout(() => {
      setOptions({ ...options, instruction: text });
    }, 500);
    return () => clearTimeout(handler);
  }, [text, setOptions]);

  return (
    <textarea
      className="w-full h-[300px] bg-transparent text-stone-50 p-4 border border-stone-600 rounded-md"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}
