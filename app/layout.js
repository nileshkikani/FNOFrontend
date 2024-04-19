// import { Inter } from "next/font/google";
// import dynamic from "next/dynamic";
import "./globals.css";

//-------CONTEXTS------
import { ActiveOiProvider } from "@/context/ActiveOIContext";
import { NiftyFutureProvider } from "@/context/NiftyFutureContext";
import { CashflowProvider } from "@/context/CashflowContext";
import { FiiDiiDataProvider } from "@/context/FiiDiiDataContext";
import { SecurityWiseProvider } from "@/context/SecurityWiseContext";

//--------COMPONENTS-----------
// const Navbar = dynamic(() => import('@/component/Navbar'), { ssr: false })
import Navbar from "@/component/Navbar";

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Algo Trading",
  description: "Advance tool for FnO trading",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        {
          <SecurityWiseProvider>
            <FiiDiiDataProvider>
              <ActiveOiProvider>
                <CashflowProvider>
                  <NiftyFutureProvider>{children}</NiftyFutureProvider>
                </CashflowProvider>
              </ActiveOiProvider>
            </FiiDiiDataProvider>
          </SecurityWiseProvider>
        }
      </body>
    </html>
  );
}
