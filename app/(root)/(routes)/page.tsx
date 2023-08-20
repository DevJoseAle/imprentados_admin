"use client"

import { useStoreModal } from '@/hooks/use-store-modal';
import { useEffect } from 'react';


const SetupPage = () => {

  const isOpen = useStoreModal((state) => state.isOpen)
  const onOpen = useStoreModal((state) => state.onOpen)
  
  useEffect(() => {
    if(!isOpen) return (onOpen());
  }, [isOpen, onOpen])
  
   return null
  //(
  //   <div className='p-4'>

  //     Root Page
  //   </div>
  // )
}

export default SetupPage
