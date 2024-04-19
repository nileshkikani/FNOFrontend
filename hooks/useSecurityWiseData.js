import { SecurityWiseContext } from "@/context/SecurityWiseContext";
import { useContext } from "react";

const useSecurityWiseData = () => {
  return useContext(SecurityWiseContext);
};

export default useSecurityWiseData;
