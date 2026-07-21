export function Button({children, className, textColor="black", bgColor="#F3C304", type="primary"}) {
  const bg = type === "primary" ? bgColor : "transparent";
  const border = type !== "primary" ? "2px solid #F3C304" : "none";
  const hoverBg = type === "primary" ? "transparent" : bgColor;
   return <button className={`px-4 py-2 font-bold text-2xl bg-[${bgColor}] text-${textColor} rounded-md transition-colors duration-200 border-[${border}] hover:bg-[${hoverBg}] ${className}`}>{children}</button>

}
