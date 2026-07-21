import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface CompactTableProps {
    children: React.ReactNode;
    className?: string;
}

export function CompactTable({ children, className }: CompactTableProps) {
    return (
        <div className={cn("rounded-lg border border-border/50 overflow-hidden", className)}>
            <Table>{children}</Table>
        </div>
    );
}

interface CompactTableHeaderProps {
    children: React.ReactNode;
    gradient?: string;
}

export function CompactTableHead({ children, gradient = "from-primary/10 to-accent/10" }: CompactTableHeaderProps) {
    return (
        <TableHeader className={cn("bg-gradient-to-r", gradient)}>
            <TableRow className="hover:bg-transparent border-b border-border/50">
                {children}
            </TableRow>
        </TableHeader>
    );
}

interface CompactTableRowProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export function CompactTableRow({ children, onClick, className }: CompactTableRowProps) {
    return (
        <TableRow
            onClick={onClick}
            className={cn(
                "hover:bg-accent/5 transition-colors border-b border-border/30",
                onClick && "cursor-pointer hover:scale-[1.01] transition-all",
                className
            )}
        >
            {children}
        </TableRow>
    );
}

export { TableBody, TableCell, TableHead };

