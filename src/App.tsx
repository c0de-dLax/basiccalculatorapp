import CalculatorUI from "./components/CalculatorUI";

const App = () => {
  return (
    <main className="flex fixed top-0 left-0 overflow-y-scroll justify-center items-center w-full h-full bg-[linear-gradient(to_left_top,rgb(56,189,248),rgb(186,230,253))] dark:bg-[linear-gradient(to_right,rgb(55,55,55),rgb(55,55,55))] transition duration-200">
      <CalculatorUI />
    </main>
  );
};

export default App;
