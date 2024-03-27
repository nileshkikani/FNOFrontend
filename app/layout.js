import { Inter } from "next/font/google";
import "./globals.css";

//-------CONTEXTS------
import { FutureProvider } from "@/context/FutureContext";
import { OptionsProvider } from "@/context/OptionsContext";
import { ActiveOiProvider } from "@/context/ActiveOIContext";
import { NiftyFutureProvider } from "@/context/NiftyFutureContext";
import { CashflowProvider } from "@/context/CashflowContext";

//--------COMPONENTS-----------
import Navbar from "@/component/Navbar";

const inter = Inter({ subsets: ["latin"] });

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
          <FutureProvider>
            <OptionsProvider>
              <ActiveOiProvider>
                <CashflowProvider>
                  <NiftyFutureProvider>{children}</NiftyFutureProvider>
                </CashflowProvider>
              </ActiveOiProvider>
            </OptionsProvider>
          </FutureProvider>
        }
      </body>
    </html>
  );
}
