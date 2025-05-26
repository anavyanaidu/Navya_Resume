import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Game } from "./components/Game";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-full">
        <Game />
      </div>
    </QueryClientProvider>
  );
}

export default App;
