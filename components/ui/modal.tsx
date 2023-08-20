"use client";

import React from 'react' 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';


interface Props {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: ()=> void;
    children?: React.ReactNode;
}


export const Modal: React.FC<Props> = ({
    children,
    title,
    description,
    onClose,
    isOpen
}) => {

    const onChange = (open: boolean) =>{
        if(!open) return onClose();
    }
  return (

    <Dialog open={isOpen} onOpenChange={onChange} >
        <DialogContent className='rounded-2xl'>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
                <DialogHeader>
                    <div>{children}</div>
                </DialogHeader>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}
