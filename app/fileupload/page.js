"use client";
import { useState } from "react";
import axiosInstance from "@/utils/axios";
import { API_ROUTER } from "@/services/apiRouter";
import { toast, Toaster } from "react-hot-toast";
import useFutureData from "@/hooks/useFutureData";
import useOptionsData from "@/hooks/useOptionsData";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [date, setDate] = useState("");

  const { fetchFutureData } = useFutureData();
  const { fetchOptionsData } = useOptionsData();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("e.target.files", e.target.files);
  };
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        console.error("No file selected");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("date", date);

      const response = await axiosInstance.post(
        `${API_ROUTER.MARKET_DATA}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      if (response.data) {
        await fetchFutureData();
        await fetchOptionsData();
      }
      setData(response.data.message);
      console.log("response", response.data);
    } catch (error) {
      toast.error(error.response.data.error);
      console.error("Error uploading file:", error.response.data.error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "5px",
      }}
    >
      <div
        style={{
          borderRadius: "8px",
          backgroundColor: "gray",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
        }}
      >
        <Toaster position="up-right" />
        <div
          style={{
            borderRight: "1px solid black",
            padding: 12,
          }}
        >
          <label><span className="custom-date-input-title">

            Select File Date:
            </span>
            <input
              label="label"
              type="date"
              className="custom-date-input"
              value={date}
              onChange={handleDateChange}
            />
          </label>
        </div>
        <div
          style={{
            padding: 12,
          }}
        >
          <input
            type="file"
            className="fileInput"
            accept={".csv"}
            onChange={handleFileChange}
          />
          <button
            style={{
              backgroundColor: "#04AA6D",
              color: "black",
              padding: "5px",
              textAlign: "center",
              textDecoration: "none",
              display: "inline-block",
              fontSize: "20px",
            }}
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>

        {data && (
          <div>
            <h2>Data:</h2>
            <div dangerouslySetInnerHTML={{ __html: data }} />
          </div>
        )}
      </div>
    </div>
  );
}
