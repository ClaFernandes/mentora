import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import "./BookingSuccess.css";

export default function BookingSuccess() {
    return (
        <div className="booking-success">
            <div className="booking-success_icon">
                <FiCheckCircle />
            </div>

            <h2>Pagamento confirmado!</h2>
            <p>A tua sessão foi marcada com sucesso.</p>

            <Link to="/sessoes" className="booking-success_btn">
                Ver as minhas sessões
            </Link>
        </div>
    );
}