export default function SlideOption({
  option,
  changeOption,
}: {
  head: string;
  option: boolean;
  changeOption: () => void;
}) {
  return (
    <div
      onClick={() => changeOption()}
      className={`w-20 h-10 rounded-full bg-gray-300 flex items-center px-1 cursor-pointer relative transition-colors duration-300 ${
        option ? "bg-pink-400" : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute w-full flex justify-between px-3 text-xs font-semibold text-white transition-opacity duration-300 pointer-events-none`}
      >
        <span className={`${option ? "opacity-100" : "opacity-0"}`}>ON</span>
        <span className={`${option ? "opacity-0" : "opacity-100"}`}>OFF</span>
      </div>

      <div
        className={`w-8 h-8 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          option ? "translate-x-10" : "translate-x-0"
        }`}
      />
    </div>
  );
}
