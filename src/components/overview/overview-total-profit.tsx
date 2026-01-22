import { Card, CardContent } from "@/components/ui/card";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

interface OverviewTotalProfitProps {
  value: string;
  className?: string;
}

export function OverviewTotalProfit({ value, className }: OverviewTotalProfitProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase">Total Caja</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
