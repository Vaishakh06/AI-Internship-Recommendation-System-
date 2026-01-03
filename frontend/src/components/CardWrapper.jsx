import Card from "./ui/Card";
import { FaUserGraduate } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

const CardWrapper = () => {
  return (
    <div className="mt-10 flex flex-col lg:flex-row justify-center items-center gap-4">
      <Card
        icon={<FaUserGraduate className="h-[2rem] w-[2rem]" />}
        title={"For Students"}
        subtitle={
          "Build your profile, find top-matching internships, and start your government career journey."
        } 
        buttonTitle={"Find Internships"}
        link={"/student/dashboard"}
      />
      {/* <Card
        icon={<MdAdminPanelSettings className="h-[2rem] w-[2rem]" />}
        title={"For Admins"}
        subtitle={
          "Oversee postings, view applicant matches, and optimize your internship program."
        } 
        buttonTitle={"Open Admin Panel"}
        link={"/admin/dashboard"}
      /> */}
    </div>
  );
};

export default CardWrapper;
