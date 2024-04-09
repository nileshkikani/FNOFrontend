"use client";
import React from "react";
import { useState } from "react";
import axiosInstance from "@/utils/axios";
import { API_ROUTER } from "@/services/apiRouter";
import { toast, Toaster } from "react-hot-toast";
import { useEffect } from "react";

export default function Page() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("e.target.files", e.target.files);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        console.error("No file selected");
        return;
      }
      const formData = new FormData();
      formData.append("securityfile", file);

      const response = await axiosInstance.post(
        `${API_ROUTER.SECURITYWISE_DATA}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      setData(response.data.message);
      console.log("response", response.data);
    } catch (error) {
      toast.error(error.response.data.error);
      console.error("Error uploading file:", error.response.data.error);
    }
  };

  useEffect(() => {
    const handleFatch = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_ROUTER.LIST_SECWISE_DATE}`
        );

        setData(response.data);
        console.log("response.data", response.data);

      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
    handleFatch();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
          marginBottom: "10px",
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
        </div>
      </div>
      <div className="scrolling-table">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              {/* <th></th> */}
              <th>Series</th>
              {/* <th></th> */}
              <th>Date</th>
              {/* <th></th> */}
              <th>Prev Close</th>
              {/* <th></th> */}
              <th>Open Price</th>
              {/* <th></th> */}
              <th>High Price</th>
              {/* <th></th> */}
              <th>Low Price</th>
              {/* <th></th> */}
              <th>Last Price</th>
              {/* <th></th> */}
              <th>Close Price</th>
              {/* <th></th> */}
              <th>Total Traded Quantity</th>
              {/* <th></th> */}
              <th>Turnover ₹ </th>
              {/* <th></th> */}
              <th>No. of Trades</th>
              {/* <th></th> */}
              <th>Deliverable Qty</th>
              {/* <th></th> */}
              <th>% Dly Qt to Traded Qty</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.id}>
                <td>{item.symbol}</td>
                {/* <td>|</td> */}
                <td>{item.series}</td>
                {/* <td>|</td> */}
                <td>{item.date}</td>
                {/* <td>|</td> */}
                <td>{item.prev_close}</td>
                {/* <td>|</td> */}
                <td>{item.open_price}</td>
                {/* <td>|</td> */}
                <td>{item.high_price}</td>
                {/* <td>|</td> */}
                <td>{item.low_price}</td>
                {/* <td>|</td> */}
                <td>{item.last_price}</td>
                {/* <td>|</td> */}
                <td>{item.close_price}</td>
                {/* <td>|</td> */}
                <td>{item.total_traded_quantity}</td>
                {/* <td>|</td> */}
                <td>{item.turnover}</td>
                {/* <td>|</td> */}
                <td>{item.no_of_trades}</td>
                {/* <td>|</td> */}
                <td>{item.deliverable_qty}</td>
                {/* <td>|</td> */}
                <td>{item.dly_qt_to_traded_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
