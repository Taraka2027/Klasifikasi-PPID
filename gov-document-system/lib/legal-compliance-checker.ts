// Indonesian Legal Compliance Checker
// Determines document accessibility based on Indonesian constitutional law

interface LegalRule {
  id: string
  law: string
  article: string
  description: string
  category: string
  keywords: string[]
  isRestriction: boolean
  publicAccessAllowed: boolean
}

interface ComplianceResult {
  isPublic: boolean
  legalBasis: string
  restrictionReason?: string
  confidence: number
  matchedRules: LegalRule[]
}

// Indonesian legal framework for information disclosure
const LEGAL_RULES: LegalRule[] = [
  // Public Information Disclosure Law (UU KIP)
  {
    id: "UU14-2008-ART14",
    law: "UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik",
    article: "Pasal 14",
    description: "Setiap Badan Publik wajib menyediakan Informasi Publik yang akurat, benar, dan tidak menyesatkan",
    category: "public_access",
    keywords: ["informasi publik", "transparansi", "akses publik", "keterbukaan"],
    isRestriction: false,
    publicAccessAllowed: true,
  },
  {
    id: "UU14-2008-ART17A",
    law: "UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik",
    article: "Pasal 17 huruf (a)",
    description: "Informasi yang dapat menghambat proses penegakan hukum dikecualikan",
    category: "law_enforcement",
    keywords: ["penegakan hukum", "investigasi", "penyelidikan", "proses hukum", "korupsi"],
    isRestriction: true,
    publicAccessAllowed: false,
  },
  {
    id: "UU14-2008-ART17B",
    law: "UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik",
    article: "Pasal 17 huruf (b)",
    description:
      "Informasi yang dapat mengganggu kepentingan perlindungan hak atas kekayaan intelektual dan perlindungan dari persaingan usaha tidak sehat",
    category: "intellectual_property",
    keywords: ["kekayaan intelektual", "persaingan usaha", "rahasia dagang", "paten"],
    isRestriction: true,
    publicAccessAllowed: false,
  },
  {
    id: "UU14-2008-ART17C",
    law: "UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik",
    article: "Pasal 17 huruf (c)",
    description: "Informasi yang dapat membahayakan pertahanan dan keamanan negara",
    category: "national_security",
    keywords: ["pertahanan", "keamanan negara", "militer", "intelijen", "rahasia negara"],
    isRestriction: true,
    publicAccessAllowed: false,
  },
  {
    id: "UU14-2008-ART17G",
    law: "UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik",
    article: "Pasal 17 huruf (g)",
    description: "Informasi yang dapat menghambat proses penegakan hukum",
    category: "law_enforcement",
    keywords: ["audit internal", "investigasi internal", "pemeriksaan", "dugaan korupsi"],
    isRestriction: true,
    publicAccessAllowed: false,
  },
  {
    id: "UU14-2008-ART17H",
    law: "UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik",
    article: "Pasal 17 huruf (h)",
    description:
      "Informasi yang dapat mengungkap isi akta otentik yang bersifat pribadi dan kemauan terakhir ataupun wasiat seseorang",
    category: "personal_data",
    keywords: ["data pribadi", "akta", "wasiat", "informasi personal", "privasi"],
    isRestriction: true,
    publicAccessAllowed: false,
  },

  // Population Administration Law
  {
    id: "UU23-2006-ART15",
    law: "UU No. 23 Tahun 2006 tentang Administrasi Kependudukan",
    article: "Pasal 15",
    description: "Setiap penduduk mempunyai hak untuk memperoleh dokumen kependudukan",
    category: "population_admin",
    keywords: ["administrasi kependudukan", "dokumen kependudukan", "domisili", "ktp", "kk"],
    isRestriction: false,
    publicAccessAllowed: true,
  },

  // Regional Tax Law
  {
    id: "UU28-2009-ART77",
    law: "UU No. 28 Tahun 2009 tentang Pajak Daerah dan Retribusi Daerah",
    article: "Pasal 77",
    description: "Daerah berwenang untuk mengatur Pajak Bumi dan Bangunan perdesaan dan perkotaan",
    category: "taxation",
    keywords: ["pajak daerah", "PBB", "pajak bumi bangunan", "retribusi", "tarif pajak"],
    isRestriction: false,
    publicAccessAllowed: true,
  },

  // Housing Law
  {
    id: "UU1-2011-GENERAL",
    law: "UU No. 1 Tahun 2011 tentang Perumahan dan Kawasan Permukiman",
    article: "Ketentuan Umum",
    description: "Pengaturan tentang perumahan dan kawasan permukiman untuk kepentingan publik",
    category: "housing",
    keywords: ["perumahan", "permukiman", "kawasan", "housing", "properti", "tempat tinggal"],
    isRestriction: false,
    publicAccessAllowed: true,
  },

  // Financial Information
  {
    id: "BUDGET-RESTRICTION",
    law: "UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik",
    article: "Pasal 17 huruf (a)",
    description: "Informasi anggaran yang dapat menghambat proses penegakan hukum atau mengandung strategi khusus",
    category: "budget_restriction",
    keywords: ["anggaran rahasia", "dana khusus", "alokasi sensitif", "operasi khusus"],
    isRestriction: true,
    publicAccessAllowed: false,
  },
]

export class LegalComplianceChecker {
  private rules: LegalRule[] = LEGAL_RULES

  // Check if a document can be made public
  checkCompliance(document: any): ComplianceResult {
    const matchedRules: LegalRule[] = []
    let highestConfidence = 0
    let finalDecision = true // Default to public access
    let primaryRule: LegalRule | null = null

    // Analyze document content against legal rules
    const documentText = [
      document.title || "",
      document.description || "",
      document.content || "",
      document.category || "",
      ...(document.keywords || []),
      ...(document.synonyms || []),
    ]
      .join(" ")
      .toLowerCase()

    // Check each legal rule
    this.rules.forEach((rule) => {
      const confidence = this.calculateRuleMatch(documentText, rule)

      if (confidence > 0.3) {
        // 30% confidence threshold
        matchedRules.push(rule)

        if (confidence > highestConfidence) {
          highestConfidence = confidence
          primaryRule = rule
        }

        // If any restriction rule matches with high confidence, restrict access
        if (rule.isRestriction && confidence > 0.5) {
          finalDecision = false
        }
      }
    })

    // Determine final result
    const result: ComplianceResult = {
      isPublic: finalDecision,
      legalBasis: primaryRule?.law + " - " + primaryRule?.article || "Tidak ada aturan khusus yang berlaku",
      confidence: highestConfidence,
      matchedRules: matchedRules,
    }

    if (!finalDecision && primaryRule) {
      result.restrictionReason = `${primaryRule.law} - ${primaryRule.article}: ${primaryRule.description}`
    } else if (finalDecision && primaryRule) {
      result.legalBasis = `${primaryRule.law} - ${primaryRule.article}: ${primaryRule.description}`
    }

    return result
  }

  // Calculate how well a document matches a legal rule
  private calculateRuleMatch(documentText: string, rule: LegalRule): number {
    let matchScore = 0
    const totalKeywords = rule.keywords.length

    if (totalKeywords === 0) return 0

    // Check keyword matches
    rule.keywords.forEach((keyword) => {
      if (documentText.includes(keyword.toLowerCase())) {
        matchScore += 1
      }

      // Partial matches get lower score
      const words = keyword.toLowerCase().split(" ")
      const partialMatches = words.filter((word) => documentText.includes(word))
      if (partialMatches.length > 0 && partialMatches.length < words.length) {
        matchScore += 0.3
      }
    })

    // Category bonus
    if (documentText.includes(rule.category.replace("_", " "))) {
      matchScore += 0.5
    }

    return Math.min(matchScore / totalKeywords, 1.0)
  }

  // Get all applicable laws for a category
  getApplicableLaws(category: string): LegalRule[] {
    return this.rules.filter(
      (rule) => rule.category === category || rule.keywords.some((keyword) => category.toLowerCase().includes(keyword)),
    )
  }

  // Validate document classification
  validateClassification(
    document: any,
    proposedClassification: "public" | "restricted",
  ): {
    isValid: boolean
    recommendation: string
    legalJustification: string
  } {
    const compliance = this.checkCompliance(document)

    const isValid = (proposedClassification === "public") === compliance.isPublic

    return {
      isValid,
      recommendation: compliance.isPublic ? "public" : "restricted",
      legalJustification: compliance.restrictionReason || compliance.legalBasis,
    }
  }
}

// Export singleton instance
export const legalComplianceChecker = new LegalComplianceChecker()
