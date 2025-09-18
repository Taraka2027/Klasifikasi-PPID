"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Scale, CheckCircle, XCircle, AlertTriangle, FileText } from "lucide-react"

interface ComplianceResult {
  isPublic: boolean
  legalBasis: string
  restrictionReason?: string
  confidence: number
  matchedRules: any[]
}

interface LegalCompliancePanelProps {
  document: any
  onComplianceCheck?: (result: ComplianceResult) => void
}

export function LegalCompliancePanel({ document, onComplianceCheck }: LegalCompliancePanelProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [complianceResult, setComplianceResult] = useState<ComplianceResult | null>(null)

  const handleComplianceCheck = async () => {
    setIsChecking(true)

    try {
      const response = await fetch("/api/check-compliance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: document.id,
          documentData: document,
        }),
      })

      if (!response.ok) {
        throw new Error("Compliance check failed")
      }

      const data = await response.json()
      setComplianceResult(data.compliance)

      if (onComplianceCheck) {
        onComplianceCheck(data.compliance)
      }
    } catch (error) {
      console.error("Compliance check error:", error)
    } finally {
      setIsChecking(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600"
    if (confidence >= 0.5) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "Tinggi"
    if (confidence >= 0.5) return "Sedang"
    return "Rendah"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Pemeriksaan Kepatuhan Hukum
        </CardTitle>
        <CardDescription>
          Sistem akan memeriksa dokumen berdasarkan hukum konstitusi Indonesia untuk menentukan aksesibilitas publik
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Document Info */}
        <div className="p-3 bg-muted rounded-lg">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4" />
            {document.title}
          </h4>
          <p className="text-sm text-muted-foreground mb-2">{document.description}</p>
          <div className="flex gap-2">
            <Badge variant="outline">{document.category}</Badge>
            {document.keywords?.slice(0, 3).map((keyword: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Check Button */}
        <Button onClick={handleComplianceCheck} disabled={isChecking} className="w-full">
          {isChecking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Memeriksa kepatuhan hukum...
            </>
          ) : (
            <>
              <Scale className="h-4 w-4 mr-2" />
              Periksa Kepatuhan Hukum
            </>
          )}
        </Button>

        {/* Results */}
        {complianceResult && (
          <div className="space-y-4">
            {/* Main Result */}
            <Alert className={complianceResult.isPublic ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-center gap-2">
                {complianceResult.isPublic ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium">
                    {complianceResult.isPublic ? "Dapat Diakses Publik" : "Tidak Dapat Diakses Publik"}
                  </h4>
                  <AlertDescription className="mt-1">
                    {complianceResult.isPublic
                      ? "Dokumen ini dapat dipublikasikan berdasarkan analisis hukum"
                      : "Dokumen ini dibatasi aksesnya berdasarkan peraturan yang berlaku"}
                  </AlertDescription>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={getConfidenceColor(complianceResult.confidence)}>
                    {Math.round(complianceResult.confidence * 100)}% yakin
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tingkat keyakinan: {getConfidenceLabel(complianceResult.confidence)}
                  </p>
                </div>
              </div>
            </Alert>

            {/* Legal Basis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dasar Hukum</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{complianceResult.restrictionReason || complianceResult.legalBasis}</p>
              </CardContent>
            </Card>

            {/* Matched Rules */}
            {complianceResult.matchedRules.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Aturan Hukum yang Relevan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {complianceResult.matchedRules.slice(0, 3).map((rule, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-sm">{rule.law}</h5>
                        <Badge variant={rule.isRestriction ? "destructive" : "default"} className="text-xs">
                          {rule.isRestriction ? "Pembatasan" : "Akses Publik"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{rule.article}</p>
                      <p className="text-sm">{rule.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Warning for Low Confidence */}
            {complianceResult.confidence < 0.5 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Tingkat keyakinan rendah. Disarankan untuk melakukan review manual oleh ahli hukum.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
