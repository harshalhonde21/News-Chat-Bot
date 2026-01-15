import ErrorBoundary from "@components/ErrorBoundary/ErrorBoundary";
import Chat from "./pages/Chat/Chat";
import "./styles/globals.scss";

function App() {
  return (
    <ErrorBoundary>
      <Chat />
    </ErrorBoundary>
  );
}

export default App;
