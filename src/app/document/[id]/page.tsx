import { createClient } from "@/lib/supabase/server"
import { DocumentViewer } from "@/components/document-viewer"
import { notFound } from "next/navigation"

interface DocumentPageProps {
  params: Promise<{ id: string }>
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch document from database
  const { data: document, error } = await supabase.from("documents").select("*").eq("id", id).single()

  if (error || !document) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <DocumentViewer document={document} />
    </div>
  )
}
