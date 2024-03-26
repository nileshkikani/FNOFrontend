import Link from "next/link";
// import Image from "next/image";
// import logo from "@/public/assets/algo_trading_logo.png";

export default function Home() {
  return (
    <div className="nav-div">
      <ul className="navbar-full">
        {/* <Image src={logo} width={500} height={500} alt="logo" /> */}
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
}
