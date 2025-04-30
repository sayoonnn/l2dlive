import React, { useEffect, useState } from "react";
import { useSettingContext } from "@/contexts/settingContext";

import IconButton from "@/components/ui/iconButton";
import SlideOption from "./slideOption";
import InstructionEditor from "./instructionEditor";

function MenuContainer({ children }: { children: React.ReactNode }) {
  return <div className="my-10">{children}</div>;
}

function MenuHead({ children }: { children: React.ReactNode }) {
  return <h2 className="text-stone-50 text-lg font-bold my-3">{children}</h2>;
}

export default function Menu() {
  const { options, setOptions } = useSettingContext();
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen)
    return (
      <div className="absolute bg-[rgba(0,0,0,0.8)] w-screen h-screen top-0 flex flex-col z-20">
        <div className="max-w-[800px] min-w-[600px] mx-auto px-3 overflow-auto">
          <IconButton
            className={
              "absolute m-3 text-stone-50 hover:text-stone-200 active:text-stone-400 z-20 top-0 left-0"
            }
            type={"close"}
            clickEvent={() => setIsOpen(!isOpen)}
          />

          <h1 className="my-8 text-2xl text-stone-50 font-extrabold">설정</h1>

          <MenuContainer>
            <MenuHead>자막 설정</MenuHead>
            <SlideOption
              head="자막 설정"
              option={options.caption}
              changeOption={() =>
                setOptions({ ...options, caption: !options.caption })
              }
            />
          </MenuContainer>

          <MenuContainer>
            <MenuHead>지침 설정</MenuHead>
            <InstructionEditor />
          </MenuContainer>
        </div>
      </div>
    );

  return (
    <button
      className="absolute top-0 px-4 py-2 m-7 flex font-bold text-stone-50 text-xl items-center gap-1 cursor-pointer bg-[rgba(0,0,0,0.5)] rounded-md hover:bg-[rgba(0,0,0,0.6)] active:bg-[rgba(0,0,0,0.7)] z-20"
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="material-symbols-rounded">settings</span>
      설정
    </button>
  );
}
