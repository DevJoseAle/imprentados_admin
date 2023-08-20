import { create } from "zustand";

interface useStoreModal{
    isOpen: boolean,
    onClose: ()=>void
    onOpen: ()=>void
}



export const useStoreModal = create<useStoreModal>((set)=>({
    isOpen:false,
    onOpen: () =>set({isOpen: true}),
    onClose: () =>set({isOpen: true}),
}))
