"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// import AdvanceDecline from "@/component/AdvanceDecline"

const DATA = [
  {
    path: "/listmarket",
    title: "DATA LIST",
  },
  {
    path: "/securitywise",
    title: "SECURITY WISE DATA",
  },
  {
    path: "/optionchainlist",
    title: "OPTION CHAIN LIST DATA",
  },
  {
    path: "/stockdata",
    title: "STOCK DAILY DATA",
  },
  {
    path: "/activeoi",
    title: "ACTIVE OI",
  },
  {
    path: "/optiondata",
    title: "OPTION LIST",
  },
  {
    path: "/niftyfutures",
    title: "NIFTY FUTURES",
  },
  {
    path: "/cashflow",
    title: "CASH FLOWS",
  },
];

const Navbar = () => {
  const currentPath = usePathname();

  const isActive = (path) => {
    return currentPath === path;
  };

  return (
    <>
      <div className="nav-div">
        <ul className="navbar-full">
          {DATA?.map((item,index) => (
            <li className="nav-item" key={index}>
              <Link
                href={item?.path}
                className={isActive(item.path) ? "active-link" : ""}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        {/* <AdvanceDecline/> */}
      </div>
    </>
  );
};

export default Navbar;
