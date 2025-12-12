'use client'

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Item } from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListProp {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}
export const DocumentList = (
  {
    parentDocumentId,
    level = 0,
    data,
  }: DocumentListProp
) => {
  const params = useParams()
  const router = useRouter()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const onExpand = (documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId]
    }))
  }
  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  });
  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }
  // In convex if document is undefined that's means it's loading (document=== undefined) => loading
  // And if It's failed to retrieve the document then the document === null => Error 
  // So
  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }
  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${(level * 12) + 12}px` : undefined
        }}

        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",

          expanded && "last:block",
          level === 0 && "hidden"
        )}
      > No Page Inside</p>
      {documents.map((document) => (
        <div key={document._id}>
          <Item id={document._id} onClick={() => onRedirect} label={document.title} icon={FileIcon} documentIcon={document.icon} active={params.documentId === document._id}
            level={level} onExpand={() => onExpand(document._id)} expanded={expanded[document._id]}
          />
          {
            expanded[document._id] && (
              <DocumentList parentDocumentId={document._id} level={level + 1} />
            )
          }
        </div>
      ))}
    </>
  )
} 
