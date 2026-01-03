import { useContext } from "react"; 
import { InternshipContext } from "./InternshipContext";

export const useInternships = () => useContext(InternshipContext);
