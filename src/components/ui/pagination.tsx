'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination() {
  return (
    <nav className="flex items-center justify-center w-full pt-4">
      <ul className="flex items-center gap-1">
        <li>
          <Button variant="ghost" size="icon" aria-label="Go to previous page">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>
        <li><Button variant="outline" className="h-9 w-9 p-0 bg-primary/10 text-primary border-primary/20">1</Button></li>
        <li><Button variant="ghost" className="h-9 w-9 p-0">2</Button></li>
        <li><Button variant="ghost" className="h-9 w-9 p-0">3</Button></li>
        <li><span className="p-2 text-muted-foreground">...</span></li>
        <li><Button variant="ghost" className="h-9 w-9 p-0">10</Button></li>
        <li>
          <Button variant="ghost" size="icon" aria-label="Go to next page">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  )
}
