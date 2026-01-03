import { FaArrowRightLong } from "react-icons/fa6";

const Button = ({ title, styleOptions, buttonFunc }) => {
  return (
    <button className={styleOptions} onClick={buttonFunc}>
      {title}
      <FaArrowRightLong />
    </button>
  );
};

export default Button;
