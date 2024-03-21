import { ActiveOiContext } from "@/context/ActiveOIContext";
import { useContext } from "react";

const useActiveOiData = () => {
  return useContext(ActiveOiContext);
};

export default useActiveOiData;
