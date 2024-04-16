import { CashflowContext } from "@/context/CashflowContext";
import { useContext } from "react";

const useCashflowData = () => {
  return useContext(CashflowContext);
};

export default useCashflowData;
