"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, AlertCircle, CheckCircle, Download, Eye, TrendingUp } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface SearchInterfaceProps {
  onSearchSubmit: () => void;
  onProceed: (selectedIds: number[]) => void; // Fungsi baru untuk navigasi
  searchResults: {
    id: number;
    text: string;
  }[];
}
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


export function SearchInterface({ onSearchSubmit, searchResults, onProceed }: SearchInterfaceProps) {
  // State untuk melacak item yang dicentang
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  // Fungsi untuk menangani perubahan checkbox
  const handleCheckboxChange = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Masukkan Permintaan Informasi</CardTitle>
          <CardDescription>
            Untuk contoh ini, cukup tekan tombol "Submit" untuk menampilkan hasil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Tolong Masukan Permintaan Informasi yang Ingin Diklasifikasikan..."
            className="min-h-[100px]"
          />
          <Button onClick={onSearchSubmit} className="w-full mt-4">
            Submit
          </Button>
        </CardContent>
      </Card>

      {/* Bagian Hasil Pencarian */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pilih Opsi yang Paling Relevan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchResults.map((result) => (
              <div key={result.id} className="flex items-center space-x-3 p-3 border rounded-md">
                <input
                  type="checkbox"
                  id={`item-${result.id}`}
                  className="h-4 w-4"
                  onChange={() => handleCheckboxChange(result.id)}
                  checked={selectedItems.includes(result.id)}
                />
                <label htmlFor={`item-${result.id}`} className="text-sm">
                  {result.text}
                </label>
              </div>
            ))}
            <Button
              className="w-full mt-4"
              onClick={() => onProceed(selectedItems)}
              disabled={selectedItems.length === 0} // Tombol disable jika tidak ada yang dipilih
            >
              Lanjutkan Klasifikasi untuk Item Terpilih
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Panduan Penggunaan tetap di sini */}
    </div>
  )
}