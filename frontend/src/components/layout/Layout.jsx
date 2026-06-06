import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      <Sidebar/>
      <main className="md:ml-64 pb-20 md:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-8">{children}</div>
      </main>
      <MobileNav/>
    </div>
  );
}
