export const PARTNER_COLORS = ['#6C63FF','#FF6584','#43BCCD','#F9C74F','#90BE6D','#F8961E','#277DA1','#E63946','#2EC4B6','#FF9F1C'];
export const POSITIONS      = ['Missionary','Doggy Style','Cowgirl','Reverse Cowgirl','Spoon','Standing','Sitting','Other'];
export const MOOD_OPTIONS   = [{label:'😍 Amazing',value:'Amazing'},{label:'😊 Good',value:'Good'},{label:'😐 Okay',value:'Okay'},{label:'😔 Meh',value:'Meh'},{label:'😴 Tired',value:'Tired'}];
export const PHYSICAL_TAGS  = ['Cardio Heavy','Light Activity','Intense','Quick','Long Session','Sweaty','Relaxed','Energetic'];
export const MENTAL_TAGS    = ['Emotionally Connected','Casual','Anxious','Confident','Stressed','Peaceful','Romantic','Adventurous'];
export const HEALTH_TAGS    = ['Safe','Unprotected','Protected','STI Checked','On Pill','IUD','Condom','Pull Out'];
export const PERIOD_FLOW    = [{label:'None',value:'none',color:'#555'},{label:'Light',value:'light',color:'#f4a4a4'},{label:'Medium',value:'medium',color:'#e05c5c'},{label:'Heavy',value:'heavy',color:'#a00000'}];
export const BLOOD_TYPES    = ['','A+','A-','B+','B-','AB+','AB-','O+','O-'];
export const ordinal = n => { const s=['th','st','nd','rd'],v=n%100; return n+(s[(v-20)%10]||s[v]||s[0]); };
export const calcCalories = ({durationMin=30,intensity='medium',bodyWeightKg=70,positions=[]}) => {
  const MET={light:3.5,medium:5,intense:7};
  let c=((MET[intensity]||5)*bodyWeightKg*durationMin)/60;
  if(positions.includes('Standing')||positions.includes('Cowgirl'))c*=1.1;
  if(positions.includes('Doggy Style')||positions.includes('Reverse Cowgirl'))c*=1.05;
  return Math.round(c);
};
