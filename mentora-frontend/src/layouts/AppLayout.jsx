import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "./AppLayout.css";

export default function AppLayout() {
    const location = useLocation();

    const isBookingFlow =
        location.pathname.startsWith("/agendar") ||
        location.pathname.startsWith("/sessoes");

    return (
        <div className="app-layout">
            <Header />

            {isBookingFlow && (
                <div className="app-layout_stripe-banner">
                    Ambiente de teste — nenhum pagamento real será processado.
                </div>
            )}

            <main className="app-layout_main">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}