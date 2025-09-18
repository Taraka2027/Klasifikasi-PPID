import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Search, AlertTriangle } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">Kelola sistem dokumen pemerintah dan pantau aktivitas pencarian</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dokumen</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dokumen Publik</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">856</div>
            <p className="text-xs text-muted-foreground">69% dari total dokumen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pencarian Hari Ini</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+5 dari kemarin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dokumen Terbatas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">378</div>
            <p className="text-xs text-muted-foreground">31% dari total dokumen</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pencarian Terbaru</CardTitle>
            <CardDescription>Aktivitas pencarian pegawai dalam 24 jam terakhir</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { query: "dokumen perumahan", employee: "EMP001", time: "2 menit lalu", results: 3 },
              { query: "pajak bumi bangunan", employee: "EMP002", time: "15 menit lalu", results: 5 },
              { query: "anggaran daerah", employee: "EMP003", time: "1 jam lalu", results: 2 },
              { query: "investigasi korupsi", employee: "EMP001", time: "2 jam lalu", results: 1 },
            ].map((search, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">"{search.query}"</p>
                  <p className="text-xs text-muted-foreground">
                    oleh {search.employee} • {search.time}
                  </p>
                </div>
                <Badge variant="outline">{search.results} hasil</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kategori Dokumen</CardTitle>
            <CardDescription>Distribusi dokumen berdasarkan kategori</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { category: "Administrasi Kependudukan", count: 245, public: 180 },
              { category: "Perpajakan", count: 189, public: 156 },
              { category: "Keuangan Daerah", count: 167, public: 89 },
              { category: "Pengawasan Internal", count: 134, public: 45 },
              { category: "Peraturan Daerah", count: 123, public: 98 },
            ].map((cat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{cat.category}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline">{cat.count} total</Badge>
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      {cat.public} publik
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(cat.public / cat.count) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
