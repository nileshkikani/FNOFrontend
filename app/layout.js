import { Inter } from 'next/font/google';
// import dynamic from "next/dynamic";
import './globals.css';

//-------CONTEXTS------
import { SecurityWiseProvider } from '@/context/SecurityWiseContext';
import { AuthProvider } from '@/context/AuthContext';

//--------COMPONENTS-----------
import dynamic from 'next/dynamic';
// import Navbar from '@/component/Header/Navbar';
import Header from '@/component/Header';
import { Toaster } from 'react-hot-toast';
// import Navbar from "@/component/Navbar";

const ReduxProvider = dynamic(() => import('@/store/redux-provider'), {
  ssr: false
});

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Algo Trading',
  description: 'Advance tool for FnO trading'
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ReduxProvider>
          <AuthProvider>
            <Toaster />
            <Header />
            {
              <SecurityWiseProvider>
                  {children}
              </SecurityWiseProvider>
            }
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
