import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useSocketStore } from "../features/socketStore.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";

export function NetworkGraph() {
  const svgRef = useRef(null);
  const { connections, messages, selectedConnection, setSelectedConnection } =
    useSocketStore();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: Math.max(400, container.clientHeight),
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || connections.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;

    // Create main group for zoom/pan
    const g = svg.append("g");

    // Set up zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Prepare data
    const nodes = connections.map((conn) => ({
      id: conn.clientId,
      ...conn,
      x: conn.x || Math.random() * width,
      y: conn.y || Math.random() * height,
    }));

    // Create links from recent messages
    const recentMessages = messages.filter(
      (msg) => Date.now() - msg.timestamp < 30000, // Last 30 seconds
    );

    const links = recentMessages.map((msg) => ({
      source: msg.from,
      target: msg.to,
      message: msg,
    }));

    // Set up force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(25));

    // Create links
    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", (d) => {
        const latency = d.message.latency || 0;
        if (latency > 200) return "#ef4444"; // red for high latency
        if (latency > 100) return "#f59e0b"; // yellow for medium latency
        return "#10b981"; // green for low latency
      })
      .attr("stroke-width", (d) =>
        Math.max(1, Math.min(5, d.message.size / 1000)),
      )
      .attr("stroke-opacity", 0.7);

    // Create nodes
    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended),
      );

    // Add circles for nodes
    node
      .append("circle")
      .attr("r", (d) => Math.max(8, Math.min(20, Math.sqrt(d.messageCount))))
      .attr("fill", (d) => {
        if (d.status === "error") return "#ef4444";
        if (d.status === "disconnected") return "#6b7280";
        return "#3b82f6";
      })
      .attr("stroke", (d) =>
        selectedConnection === d.id ? "#f59e0b" : "#1f2937",
      )
      .attr("stroke-width", (d) => (selectedConnection === d.id ? 3 : 1))
      .style("cursor", "pointer");

    // Add labels
    node
      .append("text")
      .text((d) => d.clientId.slice(0, 8))
      .attr("font-size", "10px")
      .attr("fill", "#e5e7eb")
      .attr("text-anchor", "middle")
      .attr("dy", 25);

    // Add click handler for node selection
    node.on("click", (event, d) => {
      setSelectedConnection(selectedConnection === d.id ? null : d.id);
    });

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [
    connections,
    messages,
    selectedConnection,
    dimensions,
    setSelectedConnection,
  ]);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Network Topology</span>
          <span className="text-sm text-muted-foreground">
            ({connections.length} nodes, {messages.length} recent messages)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative" style={{ height: dimensions.height }}>
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            style={{ background: "var(--card)" }}
          />

          {/* Legend */}
          <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border rounded-lg p-3 text-xs">
            <div className="space-y-2">
              <div className="font-medium">Connection Status</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Error</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span>Disconnected</span>
              </div>
              <div className="mt-3 font-medium">Message Latency</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-green-500"></div>
                <span>&lt;100ms</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-yellow-500"></div>
                <span>100-200ms</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-red-500"></div>
                <span>&gt;200ms</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
