import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "../utils/cn";

export function MetricsCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  className,
  valueColor = "default",
}) {
  const getValueColorClass = (color) => {
    switch (color) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "error":
        return "text-error";
      case "info":
        return "text-info";
      default:
        return "text-foreground";
    }
  };

  const getChangeColorClass = (change) => {
    if (change > 0) return "text-success";
    if (change < 0) return "text-error";
    return "text-muted-foreground";
  };

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className={cn("text-2xl font-bold", getValueColorClass(valueColor))}>
            {value}
          </div>
          {change !== undefined && (
            <div className={cn("text-xs", getChangeColorClass(change))}>
              {change > 0 ? "+" : ""}{change.toFixed(1)}%
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
