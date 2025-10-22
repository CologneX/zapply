"use client";

import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  children: ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export function DashboardSection({
  title,
  searchValue = "",
  onSearchChange,
  children,
  isEmpty = false,
  emptyMessage = "No items yet. Create one to get started!",
}: DashboardSectionProps) {
  return (
    <section className="w-full space-y-3">
      {/* Header with Search */}
      <div className="flex items-center justify-between gap-4">
        <h3>{title}</h3>
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full md:w-48"
        />
      </div>

      {/* Content or Empty State */}
      {isEmpty ? (
        <div className="flex items-center justify-center rounded-lg border border-border bg-muted/20 p-12">
          <p className="text-muted-foreground text-center text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div className="relative">{children}</div>
      )}
    </section>
  );
}
