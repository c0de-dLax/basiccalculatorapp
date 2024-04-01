import React, { ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {

  return (
    <div className="flex flex-col gap-y-1 relative overflow-hidden overflow-x-hidden m-auto max-w-[460px] min-w-[300px] w-[calc(100vw-16px)] max-h-[722px] min-h-[680px] h-[calc(100vh-40px)] mobile:min-h-[440px] mobile:h-[calc(100dvh-20px)] px-[20px] pt-[2dvh] mobile:pb-2 rounded-[6px] shadow-[0px_15px_20px_rgba(0,0,0,0.4)] transition duration-200 ease-in-out bg-white dark:bg-[rgba(0,0,0,0.7)]">
      {children}
    </div>
  );
};

export default Wrapper;
