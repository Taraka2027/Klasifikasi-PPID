// Indonesian Government Document Synonym Engine
// Handles synonym matching for better search accuracy

interface SynonymGroup {
  primary: string
  synonyms: string[]
  category: string
}

// Indonesian government document synonyms database
const SYNONYM_GROUPS: SynonymGroup[] = [
  // Housing and Property
  {
    primary: "perumahan",
    synonyms: ["housing", "rumah", "tempat tinggal", "hunian", "permukiman", "kawasan", "properti"],
    category: "property",
  },
  {
    primary: "domisili",
    synonyms: ["alamat", "tempat tinggal", "kediaman", "residence", "address", "tinggal"],
    category: "property",
  },

  // Movement and Migration
  {
    primary: "perpindahan",
    synonyms: ["movement", "migrasi", "pindah", "relokasi", "mobilitas", "transmigrasi"],
    category: "movement",
  },
  {
    primary: "pergerakan",
    synonyms: ["movement", "mobilitas", "aktivitas", "dinamika", "perpindahan"],
    category: "movement",
  },

  // Taxation
  {
    primary: "pajak",
    synonyms: ["tax", "retribusi", "pungutan", "iuran", "tarif", "bea"],
    category: "taxation",
  },
  {
    primary: "PBB",
    synonyms: ["pajak bumi bangunan", "pajak properti", "pajak tanah", "pajak rumah", "property tax"],
    category: "taxation",
  },

  // Legal and Administration
  {
    primary: "dokumen",
    synonyms: ["document", "berkas", "file", "arsip", "surat", "naskah"],
    category: "administration",
  },
  {
    primary: "surat",
    synonyms: ["letter", "dokumen", "berkas", "naskah", "correspondence"],
    category: "administration",
  },
  {
    primary: "keterangan",
    synonyms: ["certificate", "sertifikat", "bukti", "konfirmasi", "statement"],
    category: "administration",
  },

  // Financial
  {
    primary: "anggaran",
    synonyms: ["budget", "dana", "keuangan", "alokasi", "biaya", "pendanaan"],
    category: "finance",
  },
  {
    primary: "keuangan",
    synonyms: ["finance", "financial", "anggaran", "dana", "ekonomi", "fiscal"],
    category: "finance",
  },

  // Investigation and Oversight
  {
    primary: "investigasi",
    synonyms: ["investigation", "penyelidikan", "pemeriksaan", "audit", "penelitian"],
    category: "oversight",
  },
  {
    primary: "korupsi",
    synonyms: ["corruption", "penyalahgunaan", "penyelewengan", "fraud", "kecurangan"],
    category: "oversight",
  },
  {
    primary: "pengawasan",
    synonyms: ["oversight", "monitoring", "supervisi", "kontrol", "pemantauan"],
    category: "oversight",
  },

  // Regional Government
  {
    primary: "daerah",
    synonyms: ["regional", "wilayah", "area", "kawasan", "lokal", "region"],
    category: "regional",
  },
  {
    primary: "pemerintah",
    synonyms: ["government", "pemda", "administrasi", "birokrasi", "instansi"],
    category: "regional",
  },
]

export class SynonymEngine {
  private synonymMap: Map<string, string[]> = new Map()

  constructor() {
    this.buildSynonymMap()
  }

  private buildSynonymMap() {
    // Build bidirectional synonym mapping
    SYNONYM_GROUPS.forEach((group) => {
      const allTerms = [group.primary, ...group.synonyms]

      allTerms.forEach((term) => {
        const synonyms = allTerms.filter((t) => t !== term)
        this.synonymMap.set(
          term.toLowerCase(),
          synonyms.map((s) => s.toLowerCase()),
        )
      })
    })
  }

  // Get synonyms for a given term
  getSynonyms(term: string): string[] {
    return this.synonymMap.get(term.toLowerCase()) || []
  }

  // Expand a search query with synonyms
  expandQuery(query: string): string[] {
    const words = query.toLowerCase().split(/\s+/)
    const expandedTerms = new Set<string>()

    // Add original query
    expandedTerms.add(query.toLowerCase())

    // Add individual words
    words.forEach((word) => {
      expandedTerms.add(word)

      // Add synonyms for each word
      const synonyms = this.getSynonyms(word)
      synonyms.forEach((synonym) => expandedTerms.add(synonym))
    })

    // Try to find multi-word synonyms
    SYNONYM_GROUPS.forEach((group) => {
      const allTerms = [group.primary, ...group.synonyms]
      allTerms.forEach((term) => {
        if (query.toLowerCase().includes(term.toLowerCase()) || term.toLowerCase().includes(query.toLowerCase())) {
          expandedTerms.add(term.toLowerCase())
          // Add all synonyms from this group
          allTerms.forEach((synonym) => expandedTerms.add(synonym.toLowerCase()))
        }
      })
    })

    return Array.from(expandedTerms)
  }

  // Find matching synonyms in document data
  findMatchingSynonyms(query: string, document: any): string[] {
    const expandedTerms = this.expandQuery(query)
    const matchedSynonyms = new Set<string>()

    // Check title, description, keywords, and synonyms
    const searchableText = [
      document.title || "",
      document.description || "",
      ...(document.keywords || []),
      ...(document.synonyms || []),
    ]
      .join(" ")
      .toLowerCase()

    expandedTerms.forEach((term) => {
      if (searchableText.includes(term)) {
        matchedSynonyms.add(term)
      }
    })

    return Array.from(matchedSynonyms)
  }

  // Calculate relevance score based on synonym matches
  calculateRelevanceScore(query: string, document: any): number {
    const expandedTerms = this.expandQuery(query)
    const matchedSynonyms = this.findMatchingSynonyms(query, document)

    if (expandedTerms.length === 0) return 0

    // Base score from matches
    let score = (matchedSynonyms.length / expandedTerms.length) * 100

    // Boost score for exact matches in title
    if (document.title?.toLowerCase().includes(query.toLowerCase())) {
      score += 50
    }

    // Boost score for matches in keywords
    const keywordMatches = (document.keywords || []).filter((keyword: string) =>
      expandedTerms.some((term) => keyword.toLowerCase().includes(term)),
    )
    score += keywordMatches.length * 10

    return Math.min(score, 100) // Cap at 100
  }
}

// Export singleton instance
export const synonymEngine = new SynonymEngine()
