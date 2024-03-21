import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link className={styles.button} href={"/listmarket_api"}>
        Data List
      </Link>
      <Link className={styles.button} href={"/market_api"}>
        File Import
      </Link>
      <Link className={styles.button} href={"/securitywise_api"}>
        Security Wise Data
      </Link>
      <Link className={styles.button} href={"/optionchainlist_api"}>
        Option Chain List Data
      </Link>
      <Link className={styles.button} href={"/stockdata_api"}>
        Stock Daily Data
      </Link>
      <Link className={styles.button} href={"/activeoi_api"}>
        ACTIVE OI
      </Link>
      <Link className={styles.button} href={"/optiondata_api"}>
        OPTION LIST
      </Link>
      <Link className={styles.button} href={"/niftyfutures_api"}>
        NIFTY FUTURES
      </Link>
    </div>
  );
}
