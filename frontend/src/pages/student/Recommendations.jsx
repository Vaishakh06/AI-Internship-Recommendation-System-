import { IoBriefcase } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { IoIosArrowUp } from "react-icons/io";
import { useRef, useState } from "react"; 
import NoDataUI from "../../components/ui/NoDataUI";  
import { useInternships } from "../../context/useInternships";

const Recommendations = ({ selectedOption }) => {
  return (
    <div className="mt-4 p-4 bg-[#1C2222] rounded-md border-[.1rem] border-[var(--primary-text-muted)]">
      <div className="">
        <h2 className="text-2xl font-semibold">{selectedOption.heading}</h2>
        <p className="text-sm text-[var(--primary-text-muted)]">
          {selectedOption.subheading}
        </p>
      </div>

      <ShowSettingsContent />
    </div>
  );
};

const ShowSettingsContent = () => {
  const { recommended } = useInternships(); 

  return (
    <div className="mt-4 flex flex-wrap gap-4">
      {recommended.length === 0 ? (
        <NoDataUI />
      ) : (
        <SettingsCardWrapper
          recommendationInternships={recommended}
        />
      )}
    </div>
  );
};

const SettingsCardWrapper = ({ recommendationInternships }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return recommendationInternships.map((data, i) => (
    <SettingsCard
      key={i}
      {...data}
      isOpen={openIndex === i}
      onToggle={() => setOpenIndex(openIndex === i ? null : i)}
    />
  ));
};

const SettingsCard = (props) => {
  const contentRef = useRef(null);
  // Redirect user to the apply link
  const handleApply = () => {
    window.open(props.applyLink, "_blank"); // opens in new tab
    // OR use: window.location.href = internship.applyLink; // same tab
  };

  return (
    <div className="border-[.1rem] h-fit w-[25rem] p-6 rounded-lg text-[var(--primary-text-muted)] bg-[#1a1a1a] shadow-md">
      {/* Header */}
      <div className="mb-2">
        <div className="w-full flex justify-between items-center mb-4">
          <div className="bg-[#008080] text-white w-fit flex items-center justify-start px-3 py-1 gap-1 text-[.8rem] rounded-xl">
            <BsStars />
            Top Match
          </div>
          <div className=" text-white w-fit flex items-center justify-start px-3 py-1 gap-1 text-[.8rem] rounded-xl">
            Match Score: {props.matchScore}
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white">{props.program}</h2>
        <h3 className="flex items-center gap-2 text-sm">
          <IoBriefcase />
          {props.organization}
        </h3>
      </div>

      {/* Perks */}
      <p className="text-sm italic">{props.perks}</p>

      {/* Skills */}
      <div className="my-4">
        <p className="text-sm mb-1">Requirements:</p>
        <div className="flex flex-wrap gap-2">
          {props.skills.map((skill) => (
            <SettingCardSkills key={skill} skill={skill} />
          ))}
        </div>
      </div>

      {/* Details Section */}
      <div className="my-3 text-sm space-y-1">
        <p className="flex items-center gap-2">
          <IoLocationSharp /> {props.location}
        </p>
        <p className="flex items-center gap-2">
          <FaRupeeSign /> {props.stipend || "Not specified"}
        </p>
        <p>
          <strong>Duration:</strong> {props.duration}
        </p>
        <p>
          <strong>Eligibility:</strong> {props.eligibility}
        </p>
        <p>
          <strong>Mode:</strong> {props.mode}
        </p>
        {props.contact_details && (
          <p>
            <strong>Contact:</strong>{" "}
            <a
              href={props.contact_details}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline"
            >
              {props.contact_details}
            </a>
          </p>
        )}
      </div>

      <div className="my-4 text-sm text-white ">
        <CardAccordin
          contentRef={contentRef}
          isOpen={props.isOpen}
          onToggle={props.onToggle}
          whyRecommend={props.notes}
        />
      </div>

      {/* CTA */}
      <button
        className="bg-[#FFE066] text-black w-full py-2 rounded-md text-sm font-semibold cursor-pointer hover:bg-yellow-400 transition"
        onClick={handleApply}
      >
        Apply Now
      </button>
    </div>
  );
};

const CardAccordin = ({ isOpen, onToggle, whyRecommend }) => {
  return (
    <div className="w-full">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <h3 className="transition-all">Why is this Recommended?</h3>
        <IoIosArrowUp
          className={`transition-transform ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </div>

      <div
        className={`transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        {/* <p className="text-sm">
          This Frontend Developer Intern position at Innovate Inc. is an
          excellent match for you, Alex. Your strong skills in JavaScript and
          React directly align with the core requirements of this role. As a
          3rd-year Computer Science student with a keen interest in Web
          Development, this internship offers the perfect opportunity to apply
          your knowledge and gain practical experience with modern web
          technologies. Furthermore, the internship's location in San Francisco
          matches your preferred location, making it a highly suitable
          opportunity for your career development.
        </p> */}
        <p className="text-sm">{whyRecommend}</p>
      </div>
    </div>
  );
};

const SettingCardSkills = ({ skill }) => {
  return (
    <span className="bg-[#2B3434] text-white rounded-xl px-2 text-xs py-1">
      {skill}
    </span>
  );
};

export default Recommendations;
