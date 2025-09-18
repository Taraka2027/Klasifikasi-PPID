"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Download,
  Eye,
  Scale,
  CheckCircle,
  XCircle,
  Calendar,
  Tag,
  AlertTriangle,
  Shield,
  BookOpen,
} from "lucide-react"

interface Document {
  id: string
  title: string
  description: string
  content: string
  file_url: string
  file_type: string
  category: string
  keywords: string[]
  synonyms: string[]
  is_public: boolean
  legal_basis: string
  legal_restriction_reason: string
  created_at: string
  updated_at: string
  relevanceScore?: number
  matchedSynonyms?: string[]
}

interface DocumentViewerProps {
  document: Document
  onClose?: () => void
}

export function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      if (document.file_url) {
        window.open(document.file_url, "_blank")
      } else {
        // Generate download for text content
        const blob = new Blob([document.content], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${document.title}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Download error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getAccessibilityIcon = () => {
    return document.is_public ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    )
  }

  const getAccessibilityBadge = () => {
    return document.is_public ? (
      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Dapat Diakses Publik
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Tidak Dapat Diakses Publik
      </Badge>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-6 w-6" />
                {document.title}
              </CardTitle>
              <CardDescription className="text-base">{document.description}</CardDescription>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline">{document.category}</Badge>
                {document.file_type && <Badge variant="outline">{document.file_type}</Badge>}
                {document.relevanceScore && (
                  <Badge variant="secondary">{Math.round(document.relevanceScore)}% relevan</Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getAccessibilityIcon()}
              {onClose && (
                <Button variant="outline" size="sm" onClick={onClose}>
                  Tutup
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Document Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informasi Dokumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Dibuat:</span>
                <span>{formatDate(document.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Diperbarui:</span>
                <span>{formatDate(document.updated_at)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Kategori:</span>
                <span>{document.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Status Akses:</span>
                {getAccessibilityBadge()}
              </div>
            </div>
          </div>

          {/* Keywords and Synonyms */}
          {(document.keywords.length > 0 || document.synonyms.length > 0) && (
            <>
              <Separator />
              <div className="space-y-3">
                {document.keywords.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Kata Kunci:</h4>
                    <div className="flex flex-wrap gap-1">
                      {document.keywords.map((keyword, index) => (
                        <Badge key={`keyword-${index}`} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {document.synonyms.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Sinonim:</h4>
                    <div className="flex flex-wrap gap-1">
                      {document.synonyms.map((synonym, index) => (
                        <Badge key={`synonym-${index}`} variant="outline" className="text-xs">
                          {synonym}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Matched Synonyms from Search */}
          {document.matchedSynonyms && document.matchedSynonyms.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Kata Kunci yang Cocok dengan Pencarian:</h4>
                <div className="flex flex-wrap gap-1">
                  {document.matchedSynonyms.map((synonym, index) => (
                    <Badge
                      key={`matched-${index}`}
                      variant="default"
                      className="text-xs bg-blue-100 text-blue-800 border-blue-200"
                    >
                      {synonym}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Legal Justification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scale className="h-5 w-5" />
            Justifikasi Hukum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className={document.is_public ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <div className="flex items-start gap-3">
              {document.is_public ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-medium mb-2">
                  {document.is_public ? "Dokumen Dapat Diakses Publik" : "Dokumen Dibatasi Aksesnya"}
                </h4>
                <AlertDescription className="text-sm leading-relaxed">
                  {document.is_public ? document.legal_basis : document.legal_restriction_reason}
                </AlertDescription>

                {!document.is_public && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Peringatan Akses Terbatas</span>
                    </div>
                    <p className="text-xs text-yellow-700">
                      Dokumen ini tidak dapat diakses oleh publik berdasarkan peraturan perundang-undangan yang berlaku.
                      Akses hanya diberikan kepada pihak yang berwenang sesuai dengan ketentuan hukum.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Alert>
        </CardContent>
      </Card>

      {/* Document Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5" />
              Isi Dokumen
            </CardTitle>
            {document.is_public && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowFullContent(!showFullContent)}>
                  <Eye className="h-4 w-4 mr-1" />
                  {showFullContent ? "Sembunyikan" : "Tampilkan Semua"}
                </Button>
                <Button size="sm" onClick={handleDownload} disabled={isLoading}>
                  <Download className="h-4 w-4 mr-1" />
                  {isLoading ? "Mengunduh..." : "Unduh"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {document.is_public ? (
            <ScrollArea className={showFullContent ? "h-96" : "h-48"}>
              <div className="prose prose-sm max-w-none">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {showFullContent ? document.content : `${document.content.substring(0, 500)}...`}
                </p>
              </div>
            </ScrollArea>
          ) : (
            <Alert>
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Isi dokumen tidak dapat ditampilkan karena dokumen ini dibatasi aksesnya berdasarkan peraturan
                perundang-undangan yang berlaku.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Additional Legal Information */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Informasi Tambahan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            • Klasifikasi dokumen ini dilakukan secara otomatis berdasarkan analisis terhadap peraturan
            perundang-undangan Indonesia
          </p>
          <p>
            • Sistem menggunakan UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik sebagai dasar utama penentuan
            aksesibilitas
          </p>
          <p>
            • Untuk pertanyaan lebih lanjut mengenai akses dokumen, silakan hubungi bagian administrasi pemerintah
            daerah
          </p>
          {!document.is_public && (
            <p className="text-red-600 font-medium">
              • Akses tidak sah terhadap dokumen terbatas dapat dikenakan sanksi sesuai peraturan yang berlaku
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
