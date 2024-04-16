import { FiiDiiDataContext } from "@/context/FiiDiiDataContext";
import { useContext } from "react";

const useFiiDiiData = () => {
  return useContext(FiiDiiDataContext);
};

export default useFiiDiiData;
