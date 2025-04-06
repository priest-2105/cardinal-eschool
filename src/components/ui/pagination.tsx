import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous</span>
      </Button>
      <Select
        value={String(currentPage)}
        onValueChange={(value) => onPageChange(Number(value))}
      >
        <SelectTrigger className="w-fit">
          <SelectValue>{`Page ${currentPage} of ${totalPages}`}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <SelectItem key={page} value={String(page)}>
              Page {page} of {totalPages}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next</span>
      </Button>
    </div>
  )
}
