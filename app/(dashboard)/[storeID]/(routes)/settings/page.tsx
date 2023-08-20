import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import React from 'react'
import {redirect} from "next/navigation"
import { SettingsForm } from './components/settingForm'



interface SettingProps{
    params:{
        storeID: string
    }
}

const SettingPage: React.FC<SettingProps> = async({params}) => {

    const {userId} = auth();

    if(!userId) {
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeID,
            userId
        }
    })

    if(!store){
        redirect('/')
    }

    
  return (
    <div className=' flex-col'>
        <div className=' flex-1 space-y-4 p-8 pt-6'>
            <SettingsForm initialData={store}/>
        </div>
    </div>
  )
}

export default SettingPage