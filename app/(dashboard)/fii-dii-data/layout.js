// import GuestGuard from "@/guards/guest-guard";
import CommonNav from "@/layouts/CommonNav";
export default function Layout({ children }) {
  return (
    <>
      <CommonNav/>
        {children}
    </>
  );
}