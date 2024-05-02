import GuestGuard from "@/guards/guest-guard";
export default function Layout({ children }) {
  return (
    <>
      <GuestGuard>{children}</GuestGuard>
    </>
  );
}

//   Layout.propTypes = {
//     children: PropTypes.node,
//   };
