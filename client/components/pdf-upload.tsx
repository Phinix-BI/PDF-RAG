"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import axios from "axios"

interface PDFFile {
  id: string
  name: string
  size: number
  file: File
}

interface PDFUploadProps {
  onFilesChange: (files: PDFFile[]) => void
}



export function PDFUpload({ onFilesChange }: PDFUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<PDFFile[]>([])

  const uploadFilesToServer = async (files: PDFFile[]) => {
    try {
      const uploadPromises = files.map(async (pdfFile) => {
        const formData = new FormData()
        formData.append('pdf', pdfFile.file)
        
        const response = await axios.post('http://localhost:5000/api/upload/pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return response.data
      })

      const results = await Promise.all(uploadPromises)
      console.log('Files uploaded successfully:', results)
      return results
    } catch (error) {
      console.error('Error uploading files:', error)
      throw error
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        file,
      }))

      const updatedFiles = [...uploadedFiles, ...newFiles]
      setUploadedFiles(updatedFiles)
      onFilesChange(updatedFiles)

      // Upload files to server
      try {
        await uploadFilesToServer(newFiles)
      } catch (error) {
        console.error('Failed to upload files:', error)
        // Optionally show error message to user
      }
    },
    [uploadedFiles, onFilesChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
  })

  const removeFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter((file) => file.id !== id)
    setUploadedFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg">Drop the PDF files here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop PDF files here</p>
                <p className="text-muted-foreground mb-4">or</p>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Choose Files
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground">Uploaded Files ({uploadedFiles.length})</h3>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {uploadedFiles.map((file) => (
              <Card key={file.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="flex-shrink-0 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
