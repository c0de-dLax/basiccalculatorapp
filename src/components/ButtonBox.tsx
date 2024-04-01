import React, { ReactNode } from "react";

interface ButtonBoxProps {
  children: ReactNode;
}

const ButtonBox: React.FC<ButtonBoxProps> = ({ children }) => {
  return (
    <section className="grid w-full h-[62%] my-auto min-h-[262px] min-w-[416px] grid-cols-4 grid-rows-5 gap-4 mobile:gap-3 mobile:min-w-[260px]">
      {children}
    </section>
  );
};

export default ButtonBox;
