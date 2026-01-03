import { IoBriefcase } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";

const Applications = ({ selectedOption }) => {
  return (
    <div className="mt-4 p-4 bg-[#1C2222] rounded-md border-[.1rem] border-[var(--primary-text-muted)]">
      <div className="">
        <h2 className="text-2xl font-semibold">{selectedOption.heading}</h2>
        <p className="text-sm text-[var(--primary-text-muted)]">
          {selectedOption.subheading}
        </p>
      </div>

      <p className="text-red-500 mt-3">
        This feature is currently unavailable as employer accounts have not yet
        been set up. At present, internship listings are sourced from external
        platforms. In the future, we plan to enable direct postings from
        employers, allowing them to publish job opportunities and internships on
        this platform. This enhancement is part of our roadmap as we continue
        development under the SIH initiative.
      </p>

      <div className="flex flex-col gap-2 mt-4">
        <ApplicationFilledCard />
        <ApplicationFilledCard />
      </div>
    </div>
  );
};

const ApplicationFilledCard = () => {
  return (
    <div className="block lg:flex border-[.1rem] border-[var(--primary-text-muted)] p-2 lg:p-4 rounded-md">
      <div className="w-full">
        <h2 className="text-lg font-semibold">Backend Developer Intern</h2>
        <div className="flex gap-2 text-sm text-[var(--primary-text-muted)]">
          <span className="flex items-center gap-2">
            <IoBriefcase />
            Data Solutions
          </span>
          <span className="flex items-center gap-2">
            <IoLocationSharp />
            New York
          </span>
        </div>
      </div>
      <span className="border-[.1rem] flex items-center justify-center gap-2 p-1 lg:p-2 min-w-[5rem] mt-2 lg:mt-0 text-sm rounded-lg">
        <FaRegClock />
        Applied
      </span>
    </div>
  );
};

export default Applications;
