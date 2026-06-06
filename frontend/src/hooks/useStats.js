import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
export const useStats = () => useQuery({ queryKey:['stats'], queryFn:async()=>(await api.get('/stats/dashboard')).data.data });
