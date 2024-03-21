import { NiftyFutureContext } from "@/context/NiftyFutureContext";
import { useContext } from "react";

const useNiftyFutureData = () => {
  return useContext(NiftyFutureContext);
};

export default useNiftyFutureData;
