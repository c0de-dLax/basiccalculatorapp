import React, { useState, useEffect, useCallback } from "react";

import Wrapper from "./Wrapper";
import Screen from "./Screen";
import ButtonBox from "./ButtonBox";
import Button from "./Button";
import ThemeSwitch from "./ThemeSwitch";
import HistoryPanel from "./HistoryPanel";

import { v4 as uuidv4 } from "uuid";
uuidv4();

export interface HistoryList {
  id: string;
  equation: string;
  result: string;
}

const btnValues = [
  ["C", "del", "%", "÷"],
  [7, 8, 9, "x"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

// Removes leading zero on integer numbers but keeps it if its a decimal
const removeLeadingZeros = (str: string) => {
  const parts = str.split(".");
  const integerPart = parts[0].replace(/^0+/, "") || "0";
  const decimalPart = parts[1] ? "." + parts[1] : "";
  return integerPart + decimalPart;
};

// Formats the input display to add space every 3 digits and prevent multiple decimal (dot) inputs
const toLocaleString = (num: string) => {
  const parts = String(num).split(".");
  const integerPart = parts[0].replace(/\d(?=(\d{3})+(\.|$))/g, "$& ");
  const decimalPart = parts[1] ? `.${parts[1]}` : "";
  return integerPart + decimalPart;
};

const removeSpaces = (num: string) => num.toString().replace(/ /g, "");

const CalculatorUI = () => {
  const [calc, setCalc] = useState({
    sign: "",
    firstOperand: "0",
    secondOperand: "0",
  });
  const [equation, setEquation] = useState("");
  const [isBlinking, setIsBlinking] = useState(false);
  const [operationHistory, setOperationHistory] = useState<HistoryList[]>([]);

  const numClickHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const value = e.currentTarget.innerHTML;

      // Checks the input if it has a percent symbol to ensure arithmetic standards are met when entering or performing math operations
      const hasPercentSymbol =
        typeof calc.secondOperand === "string" &&
        (calc.secondOperand as string).includes("%");

      const isUndefined =
        typeof calc.secondOperand === "string" &&
        (calc.secondOperand as string).includes("undefined.");

      // Checks the current input if it has a percent sign, preventing users to input additional digits beyond the percent sign
      if (
        removeSpaces(calc.secondOperand).length < 26 &&
        !hasPercentSymbol &&
        !isUndefined
      ) {
        setCalc({
          ...calc,
          secondOperand:
            calc.secondOperand === "0"
              ? value
              : parseFloat(calc.secondOperand.replace(/\s/g, "")) +
                  (parseFloat(value.replace(/\s/g, "")) % 1) ===
                0
              ? toLocaleString(removeSpaces(calc.secondOperand + value))
              : removeLeadingZeros(
                  toLocaleString(removeSpaces(calc.secondOperand + value))
                ),
          firstOperand: !calc.sign ? "0" : calc.firstOperand,
        });
      }
    },
    [calc]
  );

  const decimalClickHandler = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      const value = e ? e.currentTarget.innerHTML : ".";

      //Checks the input if it has a percent sign on it and prevent users to input a decimal (dot) if it's after a percent symbol
      const hasPercentSymbol =
        typeof calc.secondOperand === "string" &&
        (calc.secondOperand as string).includes("%");

      setCalc({
        ...calc,
        secondOperand:
          !hasPercentSymbol && !calc.secondOperand.toString().includes(".")
            ? calc.secondOperand + value
            : calc.secondOperand,
      });
    },
    [calc]
  );

  const performOperation = (num1: string, num2: string, sign: string) => {
    if (
      num1 === "undefined." ||
      num1 === "Infinity" ||
      num2 === "undefined." ||
      num2 === "Infinity"
    ) {
      return "undefined.";
    }

    const hasPercentInNum1 = typeof num1 === "string" && num1.includes("%");
    const hasPercentInNum2 = typeof num2 === "string" && num2.includes("%");

    const convertPercentToDecimal = (value: string) => {
      return typeof value === "string" && value.includes("%")
        ? parseFloat(removeSpaces(value)) * 0.01
        : parseFloat(removeSpaces(value));
    };

    const math = (a: number, b: number, sign: string) =>
      sign === "+"
        ? a + b
        : sign === "-"
        ? a - b
        : sign === "X" || sign === "x" || sign === "*"
        ? a * b
        : a / b;

    const numValue1 = convertPercentToDecimal(num1);
    const numValue2 = convertPercentToDecimal(num2);

    const result =
      hasPercentInNum1 && hasPercentInNum2
        ? `${math(
            Number((numValue1 * 100).toFixed(12)),
            Number((numValue2 * 100).toFixed(12)),
            sign
          )
            .toFixed(12)
            .replace(/\.?0+$/, "")}%`
        : (sign === "+" && hasPercentInNum2) ||
          (sign === "-" && hasPercentInNum2)
        ? `${math(
            Number(numValue1.toFixed(12)),
            Number((numValue1 * numValue2).toFixed(12)),
            sign
          )
            .toFixed(12)
            .replace(/\.?0+$/, "")}`
        : `${math(
            Number(numValue1.toFixed(12)),
            Number(numValue2.toFixed(12)),
            sign
          )
            .toFixed(12)
            .replace(/\.?0+$/, "")}`;

    if (
      result === "Infinity" ||
      result === "-Infinity" ||
      result === "undefined." ||
      result === "NaN"
    ) {
      return "undefined.";
    } else {
      return toLocaleString(result);
    }
  };

  const equalsClickHandler = useCallback(() => {
    setIsBlinking(true);
    setTimeout(() => {
      setIsBlinking(false);
    }, 200);

    if (calc.sign && calc.secondOperand) {
      // Display the performed mathematical operation in the upper screen through the operation prop
      const equationForEqualsClickHandler = `${toLocaleString(
        removeSpaces(calc.firstOperand)
      )} ${calc.sign.replace(/\*/g, "x").replace(/[/]/g, "÷")} ${toLocaleString(
        removeSpaces(calc.secondOperand)
      )} = `;

      const result = performOperation(
        calc.firstOperand,
        calc.secondOperand,
        calc.sign
      );

      setEquation(equationForEqualsClickHandler);

      setCalc((calc) => ({
        ...calc,
        firstOperand: result,
        secondOperand: result,
        sign: "",
      }));

      const addToHistoryListWithEquals = (
        equationForEqualsClickHandler: string,
        result: string
      ) => {
        const id = uuidv4();
        const operationList = {
          id: id,
          equation: equationForEqualsClickHandler,
          result: result === "Infinity" ? "undefined." : toLocaleString(result),
        };

        setOperationHistory([...operationHistory, operationList]);
      };

      return addToHistoryListWithEquals(equationForEqualsClickHandler, result);
    }
  }, [calc]);

  const signClickHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const value = e.currentTarget.innerHTML;

      if (calc.sign && calc.secondOperand !== "") {
        const equationForSignClickHandler = `${toLocaleString(
          removeSpaces(calc.firstOperand)
        )} ${calc.sign
          .replace(/\*/g, "x")
          .replace(/[/]/g, "÷")} ${toLocaleString(
          removeSpaces(calc.secondOperand)
        )} = `;

        const result = performOperation(
          calc.firstOperand,
          calc.secondOperand,
          calc.sign
        );

        const addToHistoryListWithSign = (
          equationForSignClickHandler: string,
          result: string
        ) => {
          const id = uuidv4();
          const operationList = {
            id: id,
            equation: equationForSignClickHandler,
            result:
              result === "Infinity" ? "undefined." : toLocaleString(result),
          };

          setOperationHistory([...operationHistory, operationList]);
        };

        setCalc({
          ...calc,
          sign: value,
          firstOperand: result,
          secondOperand: "",
        });

        setEquation("");
        // console.log(operationHistory)
        return addToHistoryListWithSign(equationForSignClickHandler, result);
      } else {
        setCalc({
          ...calc,
          sign: value,
          firstOperand:
            calc.firstOperand === "0" && calc.secondOperand
              ? calc.secondOperand
              : calc.firstOperand,
          secondOperand: "",
        });

        setEquation("");
      }
    },
    [calc]
  );

  const deleteClickHandler = useCallback(() => {
    setIsBlinking(true);

    setTimeout(() => {
      setIsBlinking(false);
    }, 200);

    const numString = calc.secondOperand.toString();

    const isZeroPercent = numString === "0%";

    const newNum = isZeroPercent ? 0 : numString.slice(0, -1);

    const shouldRetainDecimal =
      numString.slice(-1) === "." && !/\d/.test(numString.slice(0, -1));

    setCalc({
      ...calc,
      secondOperand: (shouldRetainDecimal ? newNum + "." : newNum) || "0",
    });
  }, [calc]);

  const percentClickHandler = useCallback(() => {
    setIsBlinking(true);

    setTimeout(() => {
      setIsBlinking(false);
    }, 200);

    const hasPercentSymbol =
      typeof calc.secondOperand === "string" &&
      calc.secondOperand.includes("%");

    // Check if the input has already a percent sign to prevent changing the value to '0%'
    if (hasPercentSymbol) {
      return;
    }

    const percentValue =
      hasPercentSymbol ||
      calc.secondOperand === null ||
      parseFloat(removeSpaces(calc.secondOperand)) === 0
        ? 0
        : parseFloat(removeSpaces(calc.secondOperand)) * 0.01;

    const sanitizedPercentValue =
      isNaN(percentValue) || percentValue === 0 ? 0 : percentValue;

    setCalc({
      ...calc,
      secondOperand:
        (sanitizedPercentValue * 100).toFixed(12).replace(/\.?0+$/, "") + "%",
    });
  }, [calc]);

  const resetClickHandler = useCallback(() => {
    setCalc({
      ...calc,
      sign: "",
      firstOperand: "0",
      secondOperand: "0",
    });

    setEquation("");
  }, [calc]);

  const clearHistoryList = () => {
    setOperationHistory([]);
  };

  useEffect(() => {
    const handleKeyboardInput = (e: KeyboardEvent) => {
      const key = e.key;

      e.preventDefault();

      if (!isNaN(parseFloat(key))) {
        numClickHandler({
          currentTarget: { innerHTML: key },
        } as React.MouseEvent<HTMLButtonElement>);
      } else {
        switch (key) {
          case "+":
          case "-":
          case "*":
          case "/":
          case "x":
          case "X":
            signClickHandler({
              currentTarget: { innerHTML: key },
            } as React.MouseEvent<HTMLButtonElement>);
            break;
          case "=":
          case "Enter":
            e.preventDefault();
            equalsClickHandler();
            break;
          case "Delete":
            e.preventDefault();
            deleteClickHandler();
            break;
          case "Backspace":
            e.preventDefault();
            resetClickHandler();
            break;
          case "%":
            percentClickHandler();
            break;
          case ".":
            e.preventDefault();
            decimalClickHandler();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyboardInput);

    return () => {
      window.removeEventListener("keydown", handleKeyboardInput);
    };
  }, [
    calc,
    numClickHandler,
    decimalClickHandler,
    signClickHandler,
    equalsClickHandler,
    percentClickHandler,
    deleteClickHandler,
    resetClickHandler,
  ]);

  return (
    <div className="m-auto">
      <Wrapper>
        <ThemeSwitch />
        <HistoryPanel
          operationHistory={operationHistory}
          clearHistoryList={clearHistoryList}
        />
        <Screen
          value={calc.secondOperand ? calc.secondOperand : calc.firstOperand}
          signops={
            calc.sign
              ? `${toLocaleString(removeSpaces(calc.firstOperand))} ${calc.sign
                  .replace(/\*/g, "x")
                  .replace(/\//g, "÷")}`
              : ""
          } // Shows the 1st operand and selected operational sign in the upper screen e.g. '1 + '
          operation={equation} // Shows the mathematical operation done in the upper screen e.g. '1 + 1 = '
          isBlinking={isBlinking} // Adds blinking effect
        />
        <ButtonBox>
          {btnValues.flat().map((btn, i) => (
            <Button
              key={i}
              title={
                btn === 0
                  ? "Zero"
                  : btn === 1
                  ? "One"
                  : btn === 2
                  ? "Two"
                  : btn === 3
                  ? "Three"
                  : btn === 4
                  ? "Four"
                  : btn === 5
                  ? "Five"
                  : btn === 6
                  ? "Six"
                  : btn === 7
                  ? "Seven"
                  : btn === 8
                  ? "Eight"
                  : btn === 9
                  ? "Nine"
                  : btn === "+"
                  ? "Add"
                  : btn === "-"
                  ? "Subtract"
                  : btn === "x"
                  ? "Multiply"
                  : btn === "÷"
                  ? "Divide by"
                  : btn === "."
                  ? "Point"
                  : btn === "="
                  ? "Equals sign"
                  : btn === "del"
                  ? "Delete"
                  : btn === "C"
                  ? "Clear" : btn === "%"
                  ? "Percent sign"
                  : ""
              }
              ariaLabel={
                btn === 0
                  ? "Zero button"
                  : btn === 1
                  ? "One button"
                  : btn === 2
                  ? "Two button"
                  : btn === 3
                  ? "Three button"
                  : btn === 4
                  ? "Four button"
                  : btn === 5
                  ? "Five button"
                  : btn === 6
                  ? "Six button"
                  : btn === 7
                  ? "Seven button"
                  : btn === 8
                  ? "Eight button"
                  : btn === 9
                  ? "Nine button"
                  : btn === "+"
                  ? "Add button"
                  : btn === "-"
                  ? "Subtract button"
                  : btn === "x"
                  ? "Multiply button"
                  : btn === "÷"
                  ? "Divide by button"
                  : btn === "."
                  ? "Point button"
                  : btn === "="
                  ? "Equals button"
                  : btn === "del"
                  ? "Delete button"
                  : btn === "C"
                  ? "Clear button" : btn === "%"
                  ? "Percent button"
                  : ""
              }
              className={
                btn === "+"
                  ? "plus dark:text-black dark:bg-[rgb(255,183,58)] ransition duration-200 ease-in-out"
                  : btn === "-"
                  ? "minus dark:text-black dark:bg-[rgb(255,183,58)] transition duration-200 ease-in-out"
                  : btn === "C"
                  ? "clear dark:text-white dark:bg-blue-600 transition duration-200 ease-in-out"
                  : btn === "del"
                  ? "delete"
                  : btn === "÷"
                  ? "divide dark:text-black dark:bg-[rgb(255,183,58)] transition duration-200 ease-in-out"
                  : btn === "=" || btn === "x" || btn === "%"
                  ? "otheroperators dark:text-black dark:bg-[rgb(255,183,58)] transition duration-200 ease-in-out"
                  : (typeof btn === "number" && btn >= 0 && btn <= 9) ||
                    btn === "."
                  ? "numbers dark:bg-red-600 transition duration-200 ease-in-out"
                  : ""
              }
              value={btn.toString()}
              onClick={
                btn === "C"
                  ? resetClickHandler
                  : btn === "del"
                  ? deleteClickHandler
                  : btn === "%"
                  ? percentClickHandler
                  : btn === "="
                  ? equalsClickHandler
                  : btn === "÷" || btn === "x" || btn === "-" || btn === "+"
                  ? signClickHandler
                  : btn === "."
                  ? decimalClickHandler
                  : numClickHandler
              }
            />
          ))}
        </ButtonBox>
      </Wrapper>
    </div>
  );
};

export default CalculatorUI;
