import { Badge } from "@/components/ui/badge"
import { Building2, Shield, Flag } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Building2 className="h-8 w-8 text-primary" />
                <Flag className="h-3 w-3 text-primary absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Portal Dokumen Pemerintah</h1>
                <p className="text-sm text-muted-foreground">Pemerintah Daerah Indonesia</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-accent/30 text-primary border-primary/30">
              <Shield className="h-3 w-3" />
              Sistem Aman
            </Badge>
            <div className="flex flex-col gap-0.5">
              <div className="w-8 h-1.5 bg-primary rounded-sm"></div>
              <div className="w-8 h-1.5 bg-background border border-border rounded-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
