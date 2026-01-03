import { optionMap } from "./optionsMap";

const ActiveOption = ({ selected }) => {
  const selectedOption = optionMap[selected];

  if (!selectedOption) {
    return <p className="text-red-500">Invalid selection</p>;
  }

  const OptionComponent = optionMap[selected].component;
  return <OptionComponent selectedOption={selectedOption} />;
};

export default ActiveOption;
