"use client";

import React from "react";
import FutureData from "@/component/futuredata";
import OptionsData from "@/component/optiondata";
import TotalData from "@/component/totaldata";
import FileImport from "@/component/fileimport";

export default function page() {
  return (
    <>
      <FileImport />
      <FutureData />
      <OptionsData />
      <TotalData />
    </>
  );
}
