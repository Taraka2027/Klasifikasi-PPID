-- Insert sample Indonesian government documents
INSERT INTO public.documents (title, description, content, category, keywords, synonyms, is_public, legal_basis, legal_restriction_reason) VALUES
(
  'Surat Keterangan Domisili',
  'Dokumen yang menyatakan tempat tinggal resmi warga negara',
  'Surat keterangan domisili adalah dokumen resmi yang dikeluarkan oleh pemerintah daerah untuk menyatakan tempat tinggal seseorang.',
  'Administrasi Kependudukan',
  ARRAY['domisili', 'tempat tinggal', 'alamat', 'keterangan'],
  ARRAY['surat domisili', 'keterangan alamat', 'bukti tempat tinggal', 'surat keterangan alamat'],
  true,
  'UU No. 23 Tahun 2006 tentang Administrasi Kependudukan - Pasal 15 mengatur hak warga negara untuk mendapatkan dokumen kependudukan',
  null
),
(
  'Dokumen Anggaran Daerah Rahasia',
  'Dokumen internal mengenai alokasi anggaran khusus',
  'Dokumen ini berisi informasi sensitif mengenai alokasi anggaran untuk operasi khusus pemerintah daerah.',
  'Keuangan Daerah',
  ARRAY['anggaran', 'keuangan', 'alokasi', 'dana'],
  ARRAY['budget daerah', 'anggaran pemerintah', 'alokasi dana', 'keuangan publik'],
  false,
  null,
  'UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik - Pasal 17 huruf (a) mengecualikan informasi yang dapat menghambat proses penegakan hukum'
),
(
  'Peraturan Daerah tentang Pajak Bumi dan Bangunan',
  'Regulasi mengenai pajak properti di wilayah daerah',
  'Peraturan daerah yang mengatur mekanisme pemungutan pajak bumi dan bangunan serta tarif yang berlaku.',
  'Perpajakan',
  ARRAY['pajak', 'bumi', 'bangunan', 'PBB', 'properti'],
  ARRAY['pajak properti', 'pajak tanah', 'pajak rumah', 'retribusi bangunan'],
  true,
  'UU No. 28 Tahun 2009 tentang Pajak Daerah dan Retribusi Daerah - Pasal 77 memberikan kewenangan daerah untuk mengatur PBB',
  null
),
(
  'Laporan Investigasi Internal',
  'Dokumen hasil investigasi internal terhadap dugaan korupsi',
  'Laporan hasil investigasi internal yang berisi temuan dan rekomendasi terkait dugaan penyalahgunaan wewenang.',
  'Pengawasan Internal',
  ARRAY['investigasi', 'korupsi', 'pengawasan', 'audit'],
  ARRAY['audit internal', 'pemeriksaan', 'investigasi korupsi', 'pengawasan kinerja'],
  false,
  null,
  'UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik - Pasal 17 huruf (g) mengecualikan informasi yang dapat menghambat proses penegakan hukum'
);
