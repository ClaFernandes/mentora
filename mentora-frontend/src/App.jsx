import { AuthProvider } from "./context/AuthContext.jsx";
import AppLayout from "./layouts/AppLayout.jsx";

function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

export default App;