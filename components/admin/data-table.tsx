"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { startTransition, useDeferredValue, useState } from "react";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
};

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  actions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
  toolbarActions?: React.ReactNode;
  summary?: React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchKey,
  searchPlaceholder = "Search...",
  actions,
  emptyMessage = "No items found.",
  toolbarActions,
  summary,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const deferredSearch = useDeferredValue(search);

  const filtered = data.filter((row) => {
    if (!searchKey || !deferredSearch) return true;
    const val = row[searchKey];
    return String(val ?? "")
      .toLowerCase()
      .includes(deferredSearch.toLowerCase());
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const av = String((a as Record<string, unknown>)[sortKey] ?? "");
    const bv = String((b as Record<string, unknown>)[sortKey] ?? "");
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {searchKey ? (
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  startTransition(() => setSearch(nextValue));
                }}
                className="h-10 rounded-xl border-border/60 bg-background pl-9 pr-10"
              />
              {search ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 rounded-lg"
                  onClick={() => setSearch("")}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs font-medium"
            >
              {sorted.length} / {data.length} records
            </Badge>
            {sortKey ? (
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-xs font-medium"
              >
                Sorted by{" "}
                {
                  columns.find((column) => String(column.key) === sortKey)
                    ?.label
                }{" "}
                ({sortDir})
              </Badge>
            ) : null}
            {summary}
          </div>
        </div>

        {toolbarActions ? (
          <div className="flex flex-wrap items-center gap-2">
            {toolbarActions}
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={cn(
                    "text-xs font-medium uppercase tracking-[0.2em]",
                    col.sortable &&
                      "cursor-pointer select-none hover:text-foreground"
                  )}
                  onClick={
                    col.sortable ? () => toggleSort(String(col.key)) : undefined
                  }
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable &&
                      sortKey === String(col.key) &&
                      (sortDir === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      ))}
                  </div>
                </TableHead>
              ))}
              {actions && (
                <TableHead className="text-right text-xs uppercase tracking-wider font-medium">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="py-12 text-center text-muted-foreground"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {emptyMessage}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {search
                        ? "Try adjusting your search query."
                        : "Add your first record to get started."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  {columns.map((col) => (
                    <TableCell
                      key={String(col.key)}
                      className="py-3.5 align-middle"
                    >
                      {col.render
                        ? col.render(
                            (row as Record<string, unknown>)[String(col.key)],
                            row
                          )
                        : String(
                            (row as Record<string, unknown>)[String(col.key)] ??
                              "—"
                          )}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-right py-3">
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-xs text-muted-foreground">
        {sorted.length} of {data.length} items
        {search && ` matching "${search}"`}
      </div>
    </div>
  );
}
