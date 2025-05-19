
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface EventStatsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const EventStatsPagination: React.FC<EventStatsPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const generatePageLinks = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
        <PaginationItem key={pageNum}>
          <PaginationLink 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onPageChange(pageNum);
            }}
            isActive={currentPage === pageNum}
          >
            {pageNum}
          </PaginationLink>
        </PaginationItem>
      ));
    } else {
      return (
        <>
          {/* First page */}
          <PaginationItem>
            <PaginationLink 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onPageChange(1);
              }}
              isActive={currentPage === 1}
            >
              1
            </PaginationLink>
          </PaginationItem>
          
          {/* Display dots if needed */}
          {currentPage > 3 && (
            <PaginationItem>
              <span className="px-2">...</span>
            </PaginationItem>
          )}
          
          {/* Pages around current page */}
          {Array.from(
            { length: Math.min(3, totalPages) },
            (_, i) => {
              let pageNum;
              if (currentPage <= 2) {
                pageNum = i + 2; // 2, 3, 4
              } else if (currentPage >= totalPages - 1) {
                pageNum = totalPages - 3 + i; // totalPages-2, totalPages-1, totalPages
              } else {
                pageNum = currentPage - 1 + i; // currentPage-1, currentPage, currentPage+1
              }
              
              if (pageNum > 1 && pageNum < totalPages) {
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(pageNum);
                      }}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            }
          ).filter(Boolean)}
          
          {/* Display dots if needed */}
          {currentPage < totalPages - 2 && (
            <PaginationItem>
              <span className="px-2">...</span>
            </PaginationItem>
          )}
          
          {/* Last page */}
          <PaginationItem>
            <PaginationLink 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onPageChange(totalPages);
              }}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        </>
      );
    }
  };

  return (
    <Pagination className="mt-6 flex justify-center">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                onPageChange(currentPage - 1);
              }
            }}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {generatePageLinks()}
        
        <PaginationItem>
          <PaginationNext 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
              }
            }}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
