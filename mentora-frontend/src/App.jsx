import AppRoutes from "./routes/AppRoutes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;