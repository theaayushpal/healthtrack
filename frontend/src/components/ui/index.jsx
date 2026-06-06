export const Avatar = ({ name='?', color='#6C63FF', size=40 }) => (
  <div style={{width:size,height:size,borderRadius:'50%',background:color,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:size*.36,flexShrink:0,userSelect:'none',fontFamily:"'Syne',sans-serif"}}>
    {(name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
  </div>
);

export const Badge = ({ label, color='#6C63FF' }) => (
  <span style={{background:color+'22',color,border:'1px solid '+color+'33',borderRadius:20,padding:'2px 10px',fontSize:11,fontWeight:600,display:'inline-block',marginRight:4,marginBottom:4}}>{label}</span>
);

export const Card = ({ children, className='', onClick, style={} }) => (
  <div onClick={onClick} className={'rounded-2xl p-5 bg-[#16162A] border border-[#2A2A45] transition-all duration-200 '+(onClick?'cursor-pointer hover:border-[#3A3A60] ':'')+className} style={style}>{children}</div>
);

export const StatCard = ({ label, value, sub, icon, color='#6C63FF' }) => (
  <Card className="text-center">
    {icon && <div className="text-2xl mb-1">{icon}</div>}
    <div className="text-3xl font-bold" style={{color,fontFamily:"'Syne',sans-serif",lineHeight:1}}>{value}</div>
    <div className="text-sm text-gray-400 mt-1.5 font-medium">{label}</div>
    {sub && <div className="text-xs text-gray-600 mt-0.5">{sub}</div>}
  </Card>
);

export const Button = ({ children, onClick, variant='primary', size='md', disabled, className='', type='button' }) => {
  const sz = {sm:'px-3 py-1.5 text-xs',md:'px-5 py-2.5 text-sm',lg:'px-7 py-3.5 text-base'}[size];
  const v  = {
    primary:  'bg-gradient-to-r from-[#6C63FF] to-[#9C63FF] text-white border-0 hover:opacity-90 shadow-lg',
    secondary:'bg-transparent text-gray-400 border border-[#2A2A45] hover:bg-white/5',
    danger:   'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
    ghost:    'bg-transparent text-gray-400 border-0 hover:text-white hover:bg-white/5',
    outline:  'bg-transparent text-[#6C63FF] border border-[#6C63FF]/40 hover:bg-[#6C63FF]/10',
  }[variant];
  return <button type={type} onClick={onClick} disabled={disabled} className={'rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5 '+sz+' '+v+' '+className}>{children}</button>;
};

export const Modal = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,.7)',backdropFilter:'blur(6px)'}}>
    <div className={'relative w-full '+(wide?'max-w-2xl':'max-w-lg')+' max-h-[90vh] overflow-y-auto rounded-2xl bg-[#16162A] border border-[#2A2A45] p-6 animate-fade-up'}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white" style={{fontFamily:"'Syne',sans-serif"}}>{title}</h2>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 text-xl">✕</button>
      </div>
      {children}
    </div>
  </div>
);

export const MultiSelect = ({ options, selected=[], onChange }) => (
  <div className="flex flex-wrap gap-1.5">
    {options.map(opt => {
      const on = selected.includes(opt);
      return <button key={opt} type="button" onClick={()=>onChange(on?selected.filter(s=>s!==opt):[...selected,opt])} className={'px-3 py-1.5 rounded-full text-xs font-semibold transition-all border '+(on?'border-[#6C63FF]/60 bg-[#6C63FF]/20 text-[#6C63FF]':'border-[#2A2A45] text-gray-400 hover:border-[#6C63FF]/30')}>{opt}</button>;
    })}
  </div>
);

export const Spinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-10 h-10 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin"/>
  </div>
);

export const EmptyState = ({ icon, title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2" style={{fontFamily:"'Syne',sans-serif"}}>{title}</h3>
    <p className="text-gray-400 text-sm mb-6 max-w-xs">{subtitle}</p>
    {action}
  </div>
);

export const RatingStars = ({ value=3, onChange, readonly }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(r => <span key={r} onClick={()=>!readonly&&onChange?.(r)} className={'text-xl transition-colors '+(readonly?'cursor-default':'cursor-pointer')} style={{color:r<=value?'#F9C74F':'#2A2A45'}}>★</span>)}
  </div>
);

export const Toggle = ({ value, onChange }) => (
  <div onClick={()=>onChange(!value)} className={'w-11 h-6 rounded-full relative cursor-pointer transition-colors '+(value?'bg-[#6C63FF]':'bg-[#2A2A45]')}>
    <div className={'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all '+(value?'left-5':'left-0.5')}/>
  </div>
);

export const SliderInput = ({ label, value, onChange, min=1, max=10, color='#6C63FF' }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm font-bold" style={{color}}>{value}/10</span>
    </div>
    <input type="range" min={min} max={max} step={1} value={value} onChange={e=>onChange(+e.target.value)}
      className="w-full h-1 rounded-full appearance-none cursor-pointer"
      style={{background:'linear-gradient(to right,'+color+' '+(value-1)/9*100+'%,#2A2A45 0)',padding:0,border:'none'}}/>
  </div>
);
