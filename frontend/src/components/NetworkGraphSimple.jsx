import { useEffect, useRef } from "react";
import { useSocketStore } from "../features/socketStore.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Badge } from "./ui/badge.jsx";
import { Network } from "lucide-react";
import * as d3 from "d3";

export function NetworkGraphSimple() {
  const { connections, messages, selectedConnection, setSelectedConnection } =
    useSocketStore();
  const svgRef = useRef();
  const simulationRef = useRef();

  useEffect(() => {
    if (!connections.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;

    // Create nodes from connections
    const nodes = connections.map(conn => ({
      id: conn.clientId,
      status: conn.status,
      messageCount: conn.messageCount || 0,
      ip: conn.ip,
      x: Math.random() * width,
      y: Math.random() * height
    }));

    // Create links from recent messages
    const recentMessages = messages.slice(0, 50);
    const linkMap = new Map();
    
    recentMessages.forEach(msg => {
      if (msg.from && msg.to && msg.to !== 'broadcast') {
        const linkId = `${msg.from}-${msg.to}`;
        if (!linkMap.has(linkId)) {
          linkMap.set(linkId, {
            source: msg.from,
            target: msg.to,
            count: 0,
            lastMessage: msg.timestamp
          });
        }
        linkMap.get(linkId).count++;
      }
    });

    const links = Array.from(linkMap.values()).filter(link => 
      nodes.find(n => n.id === link.source) && nodes.find(n => n.id === link.target)
    );

    // Create D3 force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    simulationRef.current = simulation;

    // Create SVG container
    const container = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create links
    const link = container.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link")
      .attr("stroke", "#64748b")
      .attr("stroke-width", d => Math.min(d.count / 2 + 1, 5))
      .attr("stroke-opacity", 0.6);

    // Create nodes
    const node = container.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles for nodes
    node.append("circle")
      .attr("r", d => Math.max(15, Math.min(d.messageCount / 10 + 15, 30)))
      .attr("fill", d => d.status === "connected" ? "#10b981" : "#ef4444")
      .attr("stroke", d => selectedConnection === d.id ? "#3b82f6" : "#374151")
      .attr("stroke-width", d => selectedConnection === d.id ? 3 : 2);

    // Add labels
    node.append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .text(d => d.id.slice(0, 6));

    // Add tooltips
    node.append("title")
      .text(d => `ID: ${d.id}\nStatus: ${d.status}\nMessages: ${d.messageCount}\nIP: ${d.ip}`);

    // Click handler for node selection
    node.on("click", (event, d) => {
      setSelectedConnection(selectedConnection === d.id ? null : d.id);
    });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
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
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [connections, messages, selectedConnection, setSelectedConnection]);

  return (
    <Card className="h-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Interactive Network Topology
          <Badge variant="secondary">D3.js Force Graph</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Drag nodes • Click to select • Zoom with mouse wheel • Links show message flow
        </p>
      </CardHeader>
      <CardContent className="h-full p-0">
        <div className="relative h-full flex items-center justify-center">
          {connections.length > 0 ? (
            <svg
              ref={svgRef}
              className="w-full h-full border rounded"
              viewBox="0 0 800 400"
              style={{ minHeight: "400px", background: "#f8fafc" }}
            />
          ) : (
            <div className="text-center">
              <Network className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">🌐 Network Visualization</h3>
              <p className="text-muted-foreground mb-2">
                Interactive D3.js force-directed graph
              </p>
              <p className="text-sm text-muted-foreground">
                Connect clients to see real-time network topology
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}