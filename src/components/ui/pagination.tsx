'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const pagesToShow = 5;
    const halfPagesToShow = Math.floor(pagesToShow / 2);

    if (totalPages <= pagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage > halfPagesToShow + 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
      } else {
        for (let i = 1; i < currentPage - halfPagesToShow && i < 3 ; i++) {
           if (!pageNumbers.includes(i)) pageNumbers.push(i);
        }
      }

      let startPage = Math.max(1, currentPage - halfPagesToShow);
      let endPage = Math.min(totalPages, currentPage + halfPagesToShow);

      if (currentPage <= halfPagesToShow) {
        endPage = pagesToShow;
      }
      if (currentPage + halfPagesToShow >= totalPages) {
        startPage = totalPages - pagesToShow + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        if (!pageNumbers.includes(i)) pageNumbers.push(i);
      }

      if (currentPage < totalPages - (halfPagesToShow + 1)) {
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else {
         for (let i = currentPage + halfPagesToShow + 1; i <= totalPages; i++) {
           if (!pageNumbers.includes(i)) pageNumbers.push(i);
        }
      }
    }

    // Remove duplicate ellipsis
    const finalPages = pageNumbers.filter((item, index) => item !== '...' || pageNumbers[index-1] !== '...');
    
    // Ensure first and last pages are always there if total pages > show count
    if (totalPages > pagesToShow) {
        if (!finalPages.includes(1)) finalPages.unshift(1);
        if (!finalPages.includes(totalPages)) finalPages.push(totalPages);
    }


    return finalPages.filter((item, index) => item !== '...' || (pageNumbers[index-1] < pageNumbers[index+1] - 1 && pageNumbers[index-1] !== undefined && pageNumbers[index+1] !== undefined));
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-center w-full pt-4">
      <ul className="flex items-center gap-1">
        <li>
          <Button variant="ghost" size="icon" aria-label="Go to previous page" onClick={handlePrevious} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {typeof page === 'number' ? (
              <Button
                variant={currentPage === page ? "outline" : "ghost"}
                className={`h-9 w-9 p-0 ${currentPage === page ? 'bg-primary/10 text-primary border-primary/20' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ) : (
              <span className="p-2 text-muted-foreground">...</span>
            )}
          </li>
        ))}
        <li>
          <Button variant="ghost" size="icon" aria-label="Go to next page" onClick={handleNext} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  )
}
