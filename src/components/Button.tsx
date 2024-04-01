import React, { useState } from "react";

interface ButtonProps {
  title: string;
  ariaLabel: string;
  className: string;
  value: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ ariaLabel, title, className, value, onClick }) => {
  const [buttonPressed, setButtonPressed] = useState(false);

  const pressBtnHandler = () => {
    setButtonPressed(true);
  };

  const releaseBtnHandler = () => {
    setButtonPressed(false);
  };

  return (
    <button
      title={title}
      aria-label={ariaLabel}
      className={`select-none outline-none ${className} ${buttonPressed ? "buttonShadow" : ""}`}
      onMouseDown={pressBtnHandler}
      onMouseUp={releaseBtnHandler}
      onMouseLeave={releaseBtnHandler}
      onTouchStart={pressBtnHandler}
      onTouchEnd={releaseBtnHandler}
      onClick={(e) => onClick(e)}
    >
      {value}
    </button>
  );
};

export default Button;
