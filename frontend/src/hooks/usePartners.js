import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import toast from 'react-hot-toast';
export const usePartners = () => useQuery({ queryKey:['partners'], queryFn:async()=>(await api.get('/partners')).data.data });
export const useCreatePartner = () => { const qc=useQueryClient(); return useMutation({ mutationFn:d=>api.post('/partners',d), onSuccess:()=>{qc.invalidateQueries(['partners']);toast.success('Partner added! 💑');}, onError:e=>toast.error(e.response?.data?.message||'Error') }); };
export const useUpdatePartner = () => { const qc=useQueryClient(); return useMutation({ mutationFn:({id,data})=>api.put('/partners/'+id,data), onSuccess:()=>{qc.invalidateQueries(['partners']);toast.success('Partner updated!');}, onError:e=>toast.error(e.response?.data?.message||'Error') }); };
export const useDeletePartner = () => { const qc=useQueryClient(); return useMutation({ mutationFn:id=>api.delete('/partners/'+id), onSuccess:()=>{qc.invalidateQueries(['partners']);qc.invalidateQueries(['sessions']);toast.success('Partner deleted');}, onError:e=>toast.error(e.response?.data?.message||'Error') }); };
export const usePartnerStats = id => useQuery({ queryKey:['partnerStats',id], queryFn:async()=>(await api.get('/partners/'+id+'/stats')).data.data, enabled:!!id });
