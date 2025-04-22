import { useSetting } from "@/contexts/settingContext";

export default function Caption({ text }: { text: string }) {
  const { options } = useSetting();

  if (!options.caption) return null;

  if (!text) return null;

  return (
    <div className="flex justify-center transition">
      <div className="text-xl text-white bg-[rgba(0,0,0,0.7)] px-2 py-1 rounded-sm mx-[20%]">
        {text}
      </div>
    </div>
  );
}
