import AllInternships from "../pages/student/AllInternships";
import Recommendations from "../pages/student/Recommendations";
import UserProfile from "../pages/student/UserProfile";
import Applications from "../pages/student/Applications";

export const optionMap = {
  Recommended: {
    heading: "AI-Powered Recommendations",
    subheading: "Top 3 internships curated just for you based on your profile.",
    component: Recommendations,
  },
  "My Applications": {
    heading: "My Applications",
    subheading: "Track the status of your submitted applications.",
    component: Applications,
  },
  "My Profile": {
    heading: "Your Profile",
    subheading:
      "Keep your profile updated to receive the best recommendations.",
    component: UserProfile,
  },
  "All Internships": {
    heading: "All Available Internships",
    subheading: "Browse and search through all open positions.",
    component: AllInternships,
  },
};
