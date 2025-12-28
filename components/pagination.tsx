"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { itemsPerPage } from "@/lib/constants";
import {
  Pagination as PaginationWrapper,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export default function Pagination({ totalItems }: { totalItems: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPageCount = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Number(searchParams.get("page") || 1);
  const allPages = Array.from({ length: totalPageCount }, (_, idx) => idx + 1);

  const createPageURL = (targetPage: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(targetPage));
    return `${pathname}?${params.toString()}`;
  };

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPageCount;

  return (
    <PaginationWrapper>
      <PaginationContent>
        <PaginationItem>
          {canGoPrevious && (
            <PaginationPrevious
              href={createPageURL(currentPage - 1)}
              scroll={false}
              passHref
            />
          )}
        </PaginationItem>

        {allPages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={createPageURL(page)}
              scroll={false}
              passHref
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          {canGoNext && (
            <PaginationNext
              href={createPageURL(currentPage + 1)}
              scroll={false}
              passHref
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </PaginationWrapper>
  );
}
