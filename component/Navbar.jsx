"use client";
import Link from "next/link";

const Navbar = () => {

  return (
    <div className="nav-div">
      <ul className="navbar-full">
        <li className="nav-item">
          <Link href={"/listmarket"}>Data List</Link>
        </li>
        {/* <li className="nav-item">
          <Link href={"/market"}>File Import</Link>
        </li> */}
        <li className="nav-item">
          <Link href={"/securitywise"}>Security Wise Data</Link>
        </li>
        <li className="nav-item">
          <Link href={"/optionchainlist"}>Option Chain List Data</Link>
        </li>
        <li className="nav-item">
          <Link href={"/stockdata"}>Stock Daily Data</Link>
        </li>
        <li className="nav-item">
          <Link href={"/activeoi"}>ACTIVE OI</Link>
        </li>
        <li className="nav-item">
          <Link href={"/optiondata"}>OPTION LIST</Link>
        </li>
        <li className="nav-item">
          <Link href={"/niftyfutures"}>NIFTY FUTURES</Link>
        </li>
        <li className="nav-item">
          <Link href={"/cashflow"}>CASH FLOW</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
