import "./global.css";
import { createRoot } from "react-dom/client";

const App = () => (
  <div className="min-h-screen bg-background text-foreground p-8">
    <h1 className="text-4xl font-bold text-center">SocketScope Test</h1>
    <p className="text-center mt-4 text-muted-foreground">
      This is a test to see if the basic app loads
    </p>
  </div>
);

createRoot(document.getElementById("root")).render(<App />);
