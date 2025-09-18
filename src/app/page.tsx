'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // Impor useRouter untuk navigasi
import { SearchInterface } from "@/components/search-interface"
import { Header } from "@/components/header"

// Definisikan tipe data untuk setiap item hasil
interface ResultItem {
  id: number;
  text: string;
}

const mockResults: ResultItem[] = [
  { id: 1, text: 'Rencana Pembangunan Jangka Menengah Daerah (RPJMD) Kabupaten Bojonegoro (Periode Terbaru)' },
  { id: 2, text: 'Laporan Akuntabilitas Kinerja Instansi Pemerintah (LAKIP) Dinas Pendidikan Tahun 2024' },
  { id: 3, text: 'Laporan Akuntabilitas Kinerja (LAKIP) Seluruh Pemkab Bojonegoro Tahun 2024' },
  { id: 4, text: 'Notulensi Rapat Internal Tim Anggaran Pemerintah Daerah (TAPD)' },
  { id: 5, text: 'Dokumen Hasil Rapat Pembahasan APBD 2025 dengan DPRD' },
]

export default function HomePage() {
  const [results, setResults] = useState<ResultItem[]>([])
  const router = useRouter() // Inisialisasi router

  const handleShowResults = () => {
    setResults(mockResults)
  }

  // Fungsi untuk pindah ke halaman klasifikasi
  const handleProceedToClassification = (selectedIds: number[]) => {
    console.log("Item terpilih:", selectedIds) // Untuk debugging
    // Untuk prototipe, kita langsung navigasi tanpa mengirim data
    router.push('/klasifikasi')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Sistem Manajemen Dokumen Pemerintah</h1>
            <p className="text-muted-foreground text-lg">
              Cari dan akses dokumen pemerintah dengan mudah dan sesuai hukum konstitusi Indonesia
            </p>
          </div>
          <SearchInterface
            onSearchSubmit={handleShowResults}
            searchResults={results}
            onProceed={handleProceedToClassification} // Kirim fungsi navigasi sebagai props
          />
        </div>
      </main>
    </div>
  )
}