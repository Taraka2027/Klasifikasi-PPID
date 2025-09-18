import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { legalComplianceChecker } from "@/lib/legal-compliance-checker"

export async function POST(request: NextRequest) {
  try {
    const { documentId, documentData } = await request.json()

    if (!documentData) {
      return NextResponse.json({ error: "Document data is required" }, { status: 400 })
    }

    // Check legal compliance
    const complianceResult = legalComplianceChecker.checkCompliance(documentData)

    console.log("[v0] Legal compliance check:", {
      documentTitle: documentData.title,
      isPublic: complianceResult.isPublic,
      confidence: complianceResult.confidence,
      matchedRules: complianceResult.matchedRules.length,
    })

    // If documentId is provided, update the document in database
    if (documentId) {
      const supabase = await createClient()

      const updateData = {
        is_public: complianceResult.isPublic,
        legal_basis: complianceResult.isPublic ? complianceResult.legalBasis : null,
        legal_restriction_reason: !complianceResult.isPublic ? complianceResult.restrictionReason : null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("documents").update(updateData).eq("id", documentId)

      if (error) {
        console.error("Database update error:", error)
        return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
      }
    }

    return NextResponse.json({
      compliance: complianceResult,
      updated: !!documentId,
    })
  } catch (error) {
    console.error("Compliance check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
