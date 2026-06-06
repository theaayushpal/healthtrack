import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui';
const NAV = [{to:'/',icon:'🏠',label:'Dashboard'},{to:'/partners',icon:'💑',label:'Partners'},{to:'/sessions',icon:'📋',label:'Sessions'},{to:'/analytics',icon:'📊',label:'Analytics'},{to:'/period',icon:'🩸',label:'Period'},{to:'/health',icon:'🏥',label:'Health Log'},{to:'/settings',icon:'⚙️',label:'Settings'}];
export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[#0C0C18] border-r border-[#2A2A45] px-3 py-6 fixed left-0 top-0 bottom-0 z-40">
      <div className="px-3 mb-8">
        <div className="text-xl font-bold text-gradient" style={{fontFamily:"'Syne',sans-serif"}}>❤️ HealthTrack</div>
        <div className="text-xs text-gray-600 mt-1 tracking-widest uppercase">Private Health Journal</div>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({to,icon,label}) => (
          <NavLink key={to} to={to} end={to==='/'}
            className={({isActive}) => 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all '+(isActive?'bg-[#6C63FF]/15 text-white border border-[#6C63FF]/30':'text-gray-500 hover:text-white hover:bg-white/5')}>
            <span className="text-lg leading-none">{icon}</span>{label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-[#2A2A45] pt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <Avatar name={user?.username||'U'} color="#6C63FF" size={34}/>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate text-white">{user?.username}</div>
            <div className="text-xs text-gray-600 truncate">{user?.email}</div>
          </div>
        </div>
        <button onClick={()=>{logout();navigate('/login');}} className="w-full text-left px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all">🚪 Sign out</button>
      </div>
    </aside>
  );
}
