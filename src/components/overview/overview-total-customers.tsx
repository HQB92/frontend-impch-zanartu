import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { UsersIcon } from "@heroicons/react/24/solid";

interface OverviewTotalCustomersProps {
  value: number;
  difference?: number;
  positive?: boolean;
  className?: string;
}

export function OverviewTotalCustomers({ value, difference, positive = false, className }: OverviewTotalCustomersProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase">Total de miembros</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <UsersIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        {difference !== undefined && (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {positive ? (
                <ArrowUpIcon className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
                {difference}%
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Desde el mes pasado</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
