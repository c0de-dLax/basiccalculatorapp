import React, { useState } from "react";
import { HistoryList } from "./CalculatorUI";
import { FaHistory } from "react-icons/fa";
import { FaAngleDown, FaXmark } from "react-icons/fa6";

interface HistoryPanelProps {
  operationHistory: HistoryList[];
  clearHistoryList: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ operationHistory }) => {
  const [historyPanelOpen, setHistoryPanelOpen] = useState(false);

  const togglePanelSwitch = () => {
    setHistoryPanelOpen(!historyPanelOpen);
  };

  const closePanel = () => {
    setHistoryPanelOpen(false);
  };

  return (
    <div className="mb-[-6px]">
      <button
        title="Click to open history"
        aria-label="View history"
        onClick={togglePanelSwitch}
        className="flex gap-2 justify-center items-center absolute top-0 mt-[2dvh] right-0 mr-[20px] shadow-none z-[1] w-[68px] h-[32px] rounded-[6px] text-white bg-blue-600 dark:bg-[rgb(204,204,204)] dark:text-black"
      >
        <FaHistory className="max-w-[22px]" />
        <FaAngleDown
          className={`rotateAngle max-w-[16px] ${
            historyPanelOpen ? "open" : ""
          }`}
        />
      </button>
      <div
        className={`${
          historyPanelOpen
            ? "absolute w-full h-[100%] bottom-0 left-0 bg-[rgba(0,0,0,0.2)] z-[2]"
            : ""
        }`}
      />
      <div
        className={`panel bg-white dark:bg-[rgb(204,204,204)] ${
          historyPanelOpen ? "open" : "disable-select"
        }`}
      >
        <header className="flex items-center justify-between px-[14px] w-[100%] h-[60px] smMobile:h-[50px] top-0 left-0 absolute z-[3] bg-blue-600 dark:bg-red-600">
          <span className="float-left text-xl pl-2 font-[700] tracking-[2px] text-white mobile:text-base">
            {operationHistory.length === 0
              ? "There is no history yet."
              : "History"}
          </span>
          <button
            title="Click to close history"
            aria-label="Close history"
            onClick={closePanel}
            className="w-[40px] h-[40px] bg-transparent p-1 float-right shadow-none"
          >
            <FaXmark className="w-full h-full text-blue-white rounded text-black bg-white dark:bg-[rgb(204,204,204)]" />
          </button>
        </header>
        <ul className="historyList dark:historyListDark p-4 mt-[46px] smMobile:mt-[36px] h-[calc(100%-40px)] smMobile:h-[calc(100%-30px)] overflow-y-auto">
          {operationHistory
            .slice()
            .reverse()
            .map((item) => (
              <li key={item.id}>
                <p
                  className="computation dark:computationDark flex items-center pl-2 w-full tracking-[1px] h-[44px] text-black font-[500] text-base mobile:text-sm overflow-x-auto whitespace-nowrap border-b-[1px] border-gray-400"
                >
                  {item.equation} {item.result}
                </p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default HistoryPanel;
