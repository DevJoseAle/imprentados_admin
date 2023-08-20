import prismadb from '@/lib/prismadb'

interface Props{
  params: {storeID: string}
}

const DashboardPage: React.FC<Props> = async({params}) => {
  
  const store = await prismadb.store.findFirst({
    where:{
      id: params.storeID,
     
    }
  })
  
  return (
    <>
      <div>Active Store {store?.name}
      </div>
    </>
  )
}

export default DashboardPage