'use client'

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react"
import { useMutation } from "convex/react";
import { PlusCircleIcon } from "lucide-react";
import Image from "next/image"
import { toast } from "sonner";


const DocumentsPage = () => {
  const { user } = useUser();
  const create = useMutation(api.documents.create); // here api.documents.create is same  what your file name and function name in convex folder. of the documents.ts 
  const onCreate = () => {
    const promise = create({ title: "Untitled" })
    toast.promise(promise, {
      loading: "Creating a new note",
      success: "New Note created",
      error: "Failed to create a note"
    })
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src={'/No-Data.svg'}
        height={300}
        width={300}
        alt="No-data"
      />
      <h2 className="text-lg font-md">Welcome to {user?.username}&apos;s Tracker</h2>
      <Button onClick={onCreate}><PlusCircleIcon className="h-4 w-4 mr-2 " /> Create a note</Button>
    </div>
  )
}
export default DocumentsPage
