import { useNavigate } from "react-router-dom";
import Button from "./Button";

const Card = ({ title, subtitle, buttonTitle, link, icon }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return (
    <div className="border-[.05rem] border-gray-500 bg-[#1C2222] h-fit w-[18rem] rounded-md flex flex-col justify-between gap-4 p-6">
      <div className="flex flex-col items-center gap-2">
        <span className="bg-[#163535] rounded-full h-[4rem] w-[4rem] flex items-center justify-center">
          {icon}
        </span>
        <p className="font-bold text-xl">{title}</p>
        <p className="text-[13px] text-[var(--primary-text-muted)]">{subtitle}</p>
      </div>
      <Button
        title={buttonTitle}
        styleOptions={
          "border-[.1rem] rounded-md p-2 text-sm bg-[#E9CD5F] text-black flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.03]"
        }
        buttonFunc={handleClick}
      />
    </div>
  );
};

export default Card;
