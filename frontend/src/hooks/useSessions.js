import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import toast from 'react-hot-toast';
export const useSessions = (params={}) => { const q=new URLSearchParams(params).toString(); return useQuery({ queryKey:['sessions',params], queryFn:async()=>(await api.get('/sessions?'+q)).data.data }); };
export const useCreateSession = () => { const qc=useQueryClient(); return useMutation({ mutationFn:d=>api.post('/sessions',d), onSuccess:()=>{qc.invalidateQueries(['sessions']);qc.invalidateQueries(['stats']);toast.success('Session logged! 🔥');}, onError:e=>toast.error(e.response?.data?.message||'Error') }); };
export const useUpdateSession = () => { const qc=useQueryClient(); return useMutation({ mutationFn:({id,data})=>api.put('/sessions/'+id,data), onSuccess:()=>{qc.invalidateQueries(['sessions']);qc.invalidateQueries(['stats']);toast.success('Session updated!');}, onError:e=>toast.error(e.response?.data?.message||'Error') }); };
export const useDeleteSession = () => { const qc=useQueryClient(); return useMutation({ mutationFn:id=>api.delete('/sessions/'+id), onSuccess:()=>{qc.invalidateQueries(['sessions']);qc.invalidateQueries(['stats']);toast.success('Session deleted');}, onError:e=>toast.error(e.response?.data?.message||'Error') }); };
