import './globals.css';
import Navbar from './components/Navbar';
import FloatingAddButton from './components/FloatingAddButton';

export const metadata = {
  title: 'RecipeNest',
  description: 'Your personal recipe collection',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <FloatingAddButton />
      </body>
    </html>
  );
}
