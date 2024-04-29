import { MultiStrikeContext } from "@/context/MultiStrikeContext";
import { useContext } from "react";

const useMultiStrikeData = () => {
  return useContext(MultiStrikeContext);
};

export default useMultiStrikeData;
