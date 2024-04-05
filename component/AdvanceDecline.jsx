// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AdvanceDecline = () => {
//   const [data, setData] = useState();

//   const getAdvanceDecline = async () => {
//     try {
//       const response = await axios.get(
//         "https://www.nseindia.com/api/allIndices"
//       );
//       setData(response.data.data[0]);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     getAdvanceDecline();
//   }, []);

//   return (
//     <div>
//       <div>
//         <div className="advance">Advance: {data?.advances}</div>
//         <div className="decline">Decline: {data?.declines}</div>
//       </div>
//     </div>
//   );
// };

// export default AdvanceDecline;
