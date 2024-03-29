'use client'

import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { SizeColumn, columns } from '@/components/sizes/size-columns'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/api-list'

interface SizeClientProps {
  data: SizeColumn[]
}

export const SizeClient = ({ data }: SizeClientProps) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data?.length})`}
          description="Manage Sizes for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <PlusIcon className="mr-2 size-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API Calls for Sizes" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  )
}
