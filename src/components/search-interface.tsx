"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, AlertCircle, CheckCircle, Download, Eye, TrendingUp } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

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

interface SearchResponse {
  documents: Document[]
  expandedTerms: string[]
  totalResults: number
}

export function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Document[]>([])
  const [expandedTerms, setExpandedTerms] = useState<string[]>([])
  const [employeeId] = useState("EMP001") // In real app, get from auth context

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          employeeId: employeeId,
        }),
      })

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const data: SearchResponse = await response.json()
      setSearchResults(data.documents || [])
      setExpandedTerms(data.expandedTerms || [])
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
      setExpandedTerms([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleDownload = (document: Document) => {
    if (document.file_url) {
      window.open(document.file_url, "_blank")
    } else {
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
  }

  const handleView = (document: Document) => {
    window.open(`/document/${document.id}`, "_blank")
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pencarian Dokumen
          </CardTitle>
          <CardDescription>
            Masukkan deskripsi kebutuhan dokumen Anda. Sistem akan mencari sinonim dan dokumen yang relevan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="search" className="text-sm font-medium">
              Deskripsi Kebutuhan Dokumen
            </label>
            <Textarea
              id="search"
              placeholder="Contoh: Saya ingin mencari dokumen mengenai pergerakan perumahan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button onClick={handleSearch} disabled={!searchQuery.trim() || isSearching} className="w-full">
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Mencari dokumen...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Cari Dokumen
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {expandedTerms.length > 0 && (
        <Card className="bg-accent/20 border-primary/30">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-primary">
              <TrendingUp className="h-4 w-4" />
              Kata Kunci yang Diperluas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Sistem telah memperluas pencarian Anda dengan sinonim berikut:
            </p>
            <div className="flex flex-wrap gap-1">
              {expandedTerms.map((term, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
                  {term}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">
            Hasil Pencarian ({searchResults.length} dokumen ditemukan)
          </h2>
          {searchResults.map((result) => (
            <Card key={result.id} className="relative border-l-4 border-l-primary/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {result.title}
                      {result.relevanceScore && (
                        <Badge variant="outline" className="ml-2 border-primary/30 text-primary">
                          {Math.round(result.relevanceScore)}% relevan
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        {result.category}
                      </Badge>
                      {result.file_type && (
                        <Badge variant="outline" className="border-primary/20">
                          {result.file_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.is_public ? (
                      <Badge
                        variant="default"
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Dapat Diakses Publik
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Tidak Dapat Diakses Publik
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{result.description}</p>

                {result.matchedSynonyms && result.matchedSynonyms.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-primary">Kata Kunci yang Cocok:</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.matchedSynonyms.map((synonym, index) => (
                        <Badge
                          key={`matched-${index}`}
                          variant="default"
                          className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                        >
                          {synonym}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords and Synonyms Found */}
                {(result.keywords.length > 0 || result.synonyms.length > 0) && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-primary">Kata Kunci Dokumen:</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.keywords.map((keyword, index) => (
                        <Badge key={`keyword-${index}`} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {result.synonyms.map((synonym, index) => (
                        <Badge key={`synonym-${index}`} variant="outline" className="text-xs">
                          {synonym}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legal Basis */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2 text-primary">Dasar Hukum:</h4>
                  <p className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-md border border-primary/10">
                    {result.is_public ? result.legal_basis : result.legal_restriction_reason}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {result.is_public ? (
                    <>
                      <Button size="sm" onClick={() => handleView(result)} className="bg-primary hover:bg-primary/90">
                        <Eye className="h-4 w-4 mr-1" />
                        Lihat Dokumen
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(result)}
                        className="border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Unduh Dokumen
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" disabled className="border-red-200 text-red-400 bg-transparent">
                      Dokumen Tidak Dapat Diakses
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {searchResults.length === 0 && !isSearching && searchQuery && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Tidak ada dokumen ditemukan</h3>
            <p className="text-muted-foreground">Coba gunakan kata kunci yang berbeda atau lebih spesifik</p>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card className="bg-accent/30 border-primary/30">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Panduan Penggunaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-foreground">
          <p>• Gunakan bahasa Indonesia atau Inggris dalam pencarian</p>
          <p>• Sistem akan otomatis mencari sinonim untuk meningkatkan akurasi hasil</p>
          <p>• Setiap dokumen akan diperiksa kelayakan publikasinya berdasarkan hukum konstitusi Indonesia</p>
          <p>• Dokumen yang tidak dapat diakses publik akan menampilkan dasar hukum yang melarangnya</p>
        </CardContent>
      </Card>
    </div>
  )
}
