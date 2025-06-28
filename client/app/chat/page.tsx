"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PDFUpload } from "@/components/pdf-upload"
import { ChatInterface } from "@/components/chat-interface"
import { Navigation } from "@/components/navigation"
import { ArrowLeft } from "lucide-react"
import axios from "axios";

interface PDFFile {
  id: string
  name: string
  size: number
  file: File
}

export default function ChatPage() {
  const [uploadedFiles, setUploadedFiles] = useState<PDFFile[]>([])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">PDF Chat Assistant</h1>
          <p className="text-muted-foreground">Upload your PDFs and start asking questions</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
          {/* PDF Upload Section - 40% */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Upload Documents</h2>
            <PDFUpload onFilesChange={setUploadedFiles} />
          </div>

          {/* Chat Section - 60% */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Chat with AI</h2>
            <ChatInterface hasFiles={uploadedFiles.length > 0} />
          </div>
        </div>
      </div>
    </div>
  )
}
