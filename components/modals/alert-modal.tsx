"use cliente"

import { FC, useEffect, useState } from "react"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"

interface AlertModalProps{
    isOpen: boolean,
    loading: boolean,
    onClose: ()=>void,
    onConfirm: () => Promise<void>
    
}

export const AlertModal: FC<AlertModalProps>= ({
    isOpen,
    loading,
    onClose,
    onConfirm,
}) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
      setIsMounted(true)
    
    }, [])
    if(!isMounted){
        return null
    }
  return (
        
    <Modal
    title='¿Estás Segur@?'
    description="Esta acción no se puede deshacer"
    isOpen={isOpen}
    onClose={onClose}
    >
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button
            disabled={loading}
            variant={'outline'}
            onClick={onClose}
            >
                Cancelar
            </Button>
            <Button
            disabled={loading}
            variant={'destructive'}
            onClick={onConfirm}
            >
                Continuar
            </Button>
        </div>
    </Modal>
  )
}
