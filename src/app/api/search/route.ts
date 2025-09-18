import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { synonymEngine } from "@/lib/synonym-engine"

export async function POST(request: NextRequest) {
  try {
    const { query, employeeId } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const expandedTerms = synonymEngine.expandQuery(query)
    console.log("[v0] Expanded search terms:", expandedTerms)

    const searchConditions = expandedTerms
      .map((term) => `title.ilike.%${term}%, description.ilike.%${term}%, content.ilike.%${term}%`)
      .join(", ")

    // Also search in keywords and synonyms arrays
    const keywordConditions = expandedTerms.map((term) => `keywords.cs.{${term}}, synonyms.cs.{${term}}`).join(", ")

    const { data: documents, error } = await supabase
      .from("documents")
      .select("*")
      .or(`${searchConditions}, ${keywordConditions}`)

    if (error) {
      console.error("Search error:", error)
      return NextResponse.json({ error: "Search failed" }, { status: 500 })
    }

    const documentsWithScores = (documents || []).map((doc) => ({
      ...doc,
      relevanceScore: synonymEngine.calculateRelevanceScore(query, doc),
      matchedSynonyms: synonymEngine.findMatchingSynonyms(query, doc),
    }))

    // Sort by relevance score (highest first)
    documentsWithScores.sort((a, b) => b.relevanceScore - a.relevanceScore)

    console.log(
      "[v0] Search results with scores:",
      documentsWithScores.map((d) => ({
        title: d.title,
        score: d.relevanceScore,
        matches: d.matchedSynonyms,
      })),
    )

    // Log the search
    await supabase.from("search_logs").insert({
      search_query: query,
      search_results_count: documentsWithScores.length,
      employee_id: employeeId,
    })

    return NextResponse.json({
      documents: documentsWithScores,
      expandedTerms: expandedTerms,
      totalResults: documentsWithScores.length,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
