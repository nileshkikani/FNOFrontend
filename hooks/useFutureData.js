import { FutureContext } from "@/context/FutureContext";
import { useContext } from "react";

const useFutureData = () => {
  return useContext(FutureContext);
};

export default useFutureData;
