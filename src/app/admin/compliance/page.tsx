import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scale, FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function CompliancePage() {
  // Mock data for demonstration
  const complianceStats = {
    totalDocuments: 1234,
    publicDocuments: 856,
    restrictedDocuments: 378,
    pendingReview: 23,
    highConfidence: 1089,
    lowConfidence: 145,
  }

  const recentChecks = [
    {
      id: 1,
      title: "Laporan Investigasi Internal Korupsi",
      category: "Pengawasan Internal",
      result: "restricted",
      confidence: 0.92,
      law: "UU No. 14 Tahun 2008 - Pasal 17 huruf (g)",
      timestamp: "2 jam lalu",
    },
    {
      id: 2,
      title: "Peraturan Daerah tentang Pajak Bumi dan Bangunan",
      category: "Perpajakan",
      result: "public",
      confidence: 0.88,
      law: "UU No. 28 Tahun 2009 - Pasal 77",
      timestamp: "4 jam lalu",
    },
    {
      id: 3,
      title: "Data Anggaran Operasi Khusus",
      category: "Keuangan Daerah",
      result: "restricted",
      confidence: 0.76,
      law: "UU No. 14 Tahun 2008 - Pasal 17 huruf (a)",
      timestamp: "6 jam lalu",
    },
    {
      id: 4,
      title: "Surat Keterangan Domisili",
      category: "Administrasi Kependudukan",
      result: "public",
      confidence: 0.95,
      law: "UU No. 23 Tahun 2006 - Pasal 15",
      timestamp: "8 jam lalu",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pemeriksaan Kepatuhan Hukum</h1>
        <p className="text-muted-foreground">
          Monitor dan kelola pemeriksaan kepatuhan dokumen berdasarkan hukum konstitusi Indonesia
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dokumen</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceStats.totalDocuments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Semua dokumen dalam sistem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dokumen Publik</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{complianceStats.publicDocuments}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((complianceStats.publicDocuments / complianceStats.totalDocuments) * 100)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dokumen Terbatas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{complianceStats.restrictedDocuments}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((complianceStats.restrictedDocuments / complianceStats.totalDocuments) * 100)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perlu Review</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{complianceStats.pendingReview}</div>
            <p className="text-xs text-muted-foreground">Tingkat keyakinan rendah</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keyakinan Tinggi</CardTitle>
            <Scale className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{complianceStats.highConfidence}</div>
            <p className="text-xs text-muted-foreground">≥80% tingkat keyakinan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keyakinan Rendah</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{complianceStats.lowConfidence}</div>
            <p className="text-xs text-muted-foreground">{"<"}50% tingkat keyakinan</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Compliance Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Pemeriksaan Kepatuhan Terbaru</CardTitle>
          <CardDescription>Hasil pemeriksaan kepatuhan hukum dalam 24 jam terakhir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentChecks.map((check) => (
            <div key={check.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{check.title}</h4>
                  <Badge variant="outline">{check.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{check.law}</p>
                <p className="text-xs text-muted-foreground">{check.timestamp}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    {Math.round(check.confidence * 100)}% yakin
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {check.confidence >= 0.8 ? "Tinggi" : check.confidence >= 0.5 ? "Sedang" : "Rendah"}
                  </p>
                </div>
                <div className="flex items-center">
                  {check.result === "public" ? (
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Publik
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Terbatas
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Legal Framework Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Kerangka Hukum yang Digunakan</CardTitle>
          <CardDescription>Dasar hukum yang digunakan sistem untuk menentukan aksesibilitas dokumen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">UU No. 14 Tahun 2008</h4>
              <p className="text-sm text-muted-foreground mb-2">Keterbukaan Informasi Publik</p>
              <p className="text-xs">Mengatur hak akses informasi publik dan pengecualiannya</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">UU No. 23 Tahun 2006</h4>
              <p className="text-sm text-muted-foreground mb-2">Administrasi Kependudukan</p>
              <p className="text-xs">Mengatur hak penduduk atas dokumen kependudukan</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">UU No. 28 Tahun 2009</h4>
              <p className="text-sm text-muted-foreground mb-2">Pajak Daerah dan Retribusi</p>
              <p className="text-xs">Mengatur kewenangan daerah dalam perpajakan</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">UU No. 1 Tahun 2011</h4>
              <p className="text-sm text-muted-foreground mb-2">Perumahan dan Kawasan Permukiman</p>
              <p className="text-xs">Mengatur informasi publik terkait perumahan</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
