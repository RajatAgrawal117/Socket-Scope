import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";

export function NetworkGraphSimple() {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Network Topology</span>
          <span className="text-sm text-muted-foreground">
            (Simplified View - D3.js visualization will be added)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[600px] bg-card border-border border rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🌐</div>
            <div className="text-xl font-semibold mb-2">
              Network Visualization
            </div>
            <div className="text-muted-foreground">
              Interactive D3.js force-directed graph will be rendered here
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
