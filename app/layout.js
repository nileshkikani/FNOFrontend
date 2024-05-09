import { Inter } from "next/font/google";
// import dynamic from "next/dynamic";
import "./globals.css";

//-------CONTEXTS------
import { ActiveOiProvider } from "@/context/ActiveOIContext";
import { NiftyFutureProvider } from "@/context/NiftyFutureContext";
import { CashflowProvider } from "@/context/CashflowContext";
import { FiiDiiDataProvider } from "@/context/FiiDiiDataContext";
import { SecurityWiseProvider } from "@/context/SecurityWiseContext";
import { AuthProvider } from "@/context/AuthContext";
import { MultiStrikeProvider } from "@/context/MultiStrikeContext";

//--------COMPONENTS-----------
import dynamic from "next/dynamic";
// import Navbar from "@/component/Header/Navbar";
import Navbar from "@/component/Navbar";

const ReduxProvider = dynamic(() => import("@/store/redux-provider"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Algo Trading",
  description: "Advance tool for FnO trading",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ReduxProvider>
          <AuthProvider>
            <Navbar />
            {/* {middleware(router.asPath)} */}
            {
              <SecurityWiseProvider>
                <FiiDiiDataProvider>
                  <ActiveOiProvider>
                    <CashflowProvider>
                      <MultiStrikeProvider>
                        <NiftyFutureProvider>{children}</NiftyFutureProvider>
                      </MultiStrikeProvider>
                    </CashflowProvider>
                  </ActiveOiProvider>
                </FiiDiiDataProvider>
              </SecurityWiseProvider>
            }
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
