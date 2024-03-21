import { useContext } from "react";
import { OptionsContext } from "@/context/OptionsContext";

const useOptionsData = () => {
  return useContext(OptionsContext);
};

export default useOptionsData;
