import { NavLink } from 'react-router-dom';
const NAV = [{to:'/',icon:'🏠',label:'Home'},{to:'/partners',icon:'💑',label:'Partners'},{to:'/sessions',icon:'📋',label:'Sessions'},{to:'/analytics',icon:'📊',label:'Stats'},{to:'/settings',icon:'⚙️',label:'More'}];
export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C0C18] border-t border-[#2A2A45]">
      <div className="flex items-center">
        {NAV.map(({to,icon,label}) => (
          <NavLink key={to} to={to} end={to==='/'} className={({isActive})=>'flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors '+(isActive?'text-[#6C63FF]':'text-gray-600')}>
            <span className="text-xl leading-none">{icon}</span>{label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
