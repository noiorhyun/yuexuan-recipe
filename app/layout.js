import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'RecipeNest',
  description: 'Your personal recipe collection',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
