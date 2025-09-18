import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";

// --- INI DATA PALSU UNTUK HASIL AKHIR ---
const classificationResults = [
  {
    id: 1,
    informasi: "Rencana Pembangunan Jangka Menengah Daerah (RPJMD) Kabupaten Bojonegoro (Periode Terbaru)",
    hasil: "Informasi Tersedia Setiap Saat",
    dasarHukum: "Peraturan Komisi Informasi RI No 1 Tahun 2021 Pasal 21 ayat (1) huruf h, yang menyatakan bahwa rencana strategis dan rencana kerja Badan Publik wajib disediakan setiap saat.",
    badgeColor: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    informasi: "Laporan Akuntabilitas Kinerja Instansi Pemerintah (LAKIP) Dinas Pendidikan Tahun 2024",
    hasil: "Informasi Wajib Berkala",
    dasarHukum: "UU No 14 Tahun 2008 Pasal 9 ayat (2) huruf b, yang mencakup informasi mengenai kegiatan dan kinerja Badan Publik terkait.",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  {
    id: 4,
    informasi: "Notulensi Rapat Internal Tim Anggaran Pemerintah Daerah (TAPD)",
    hasil: "Informasi Dikecualikan",
    dasarHukum: "Peraturan Komisi Informasi RI No 1 Tahun 2021 Pasal 15 ayat (4), yang menyatakan bahwa ringkasan laporan keuangan yang paling sedikit terdiri atas laporan realisasi anggaran dan daftar aset dan investasi merupakan informasi publik berkala.",
    badgeColor: "bg-red-100 text-red-800",
  },
];

export default function ClassificationResultPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {classificationResults.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <p className="text-sm font-semibold text-gray-500 mb-2">Informasi</p>
                <CardTitle>{result.informasi}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2">Hasil Klasifikasi</p>
                  <Badge className={`text-base font-semibold ${result.badgeColor}`}>{result.hasil}</Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2">Dasar Hukum</p>
                  <p className="text-gray-600">{result.dasarHukum}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}