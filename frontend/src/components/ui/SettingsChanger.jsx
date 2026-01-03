import { IoBriefcase } from "react-icons/io5";
import { GrOrganization } from "react-icons/gr";
import { FaRegUserCircle } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

const iconMap = {
  Recommended: <GrOrganization />,
  "My Applications": <IoBriefcase />,
  "My Profile": <FaRegUserCircle />,
  "All Internships": <IoDocumentTextOutline />,
};

const SettingsChanger = ({
  settingsData,
  selectedOption,
  setSelectedOption,
}) => {
  return (
    <div className="border-[.1rem] w-full overflow-hidden overflow-x-auto lg:w-fit p-2 lg:p-1 flex items-center gap-2 rounded-md">
      {settingsData.map((option) => (
        <SettingValue
          key={option.id}
          optionName={option.optionName}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      ))}
    </div>
  );
};

const SettingValue = ({ optionName, selectedOption, setSelectedOption }) => {
  const isSelected = selectedOption === optionName;
  const icon = iconMap[optionName];

  return (
    <div
      className={`h-fit w-fit border-[.1rem] rounded-md cursor-pointer lg:min-w-[6rem] transition ${
        isSelected ? "bg-blue-900 text-white" : "bg-transparent"
      }`}
      onClick={() => setSelectedOption(optionName)}
    >
      <p className="h-full w-[10rem] text-sm px-4 py-1 rounded-md text-center flex items-center justify-center gap-2">
        {icon}
        {optionName}
      </p>
    </div>
  );
};

export default SettingsChanger;
