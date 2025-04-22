import React, { useState } from "react";
import { useSetting } from "@/contexts/settingContext";

import SlideOption from "./slideOption";
import IconButton from "../iconButton";

export default function Menu() {
  const { options, setOptions } = useSetting();
  const [isOpen, setIsOpen] = useState(false);

  const setCaption = () =>
    setOptions({ ...options, caption: !options.caption });

  return !isOpen ? (
    <IconButton
      className={
        "absolute m-3 text-stone-50 hover:text-stone-200 active:text-stone-400 z-20"
      }
      type={"settings"}
      clickEvent={() => setIsOpen(!isOpen)}
    />
  ) : (
    <div className="fixed bg-[rgba(0,0,0,0.8)] w-xl h-screen top-0 flex flex-col z-20">
      <IconButton
        className={
          "absolute m-3 text-stone-50 hover:text-stone-200 active:text-stone-400 z-20"
        }
        type={"close"}
        clickEvent={() => setIsOpen(!isOpen)}
      />
      <h1 className="mx-auto my-8 text-2xl text-stone-50 font-extrabold">
        설정
      </h1>

      <SlideOption
        head="자막 설정"
        option={options.caption}
        changeOption={setCaption}
      />
    </div>
  );
}
