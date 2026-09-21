import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getFavorites } from "../../services/favoriteService.js";

export default function MenteeFavoriteOfferings() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFavorites(token)
      .then(setFavorites)
      .catch(() =>
        setError("Não foi possível carregar os favoritos. Tenta novamente."),
      );
  }, [token]);

  return (
    <section className="mentee-profile_favorites">
      <h3>Ofertas favoritas</h3>

      {error && <p className="mentee-profile_error">{error}</p>}

      {favorites.length === 0 ? (
        !error && (
          <p className="mentee-profile_favorites-empty">
            Ainda não tens nenhuma oferta favorita.
          </p>
        )
      ) : (
        <div className="mentee-profile_favorites-list">
          {favorites.map((fav) =>
            fav.offeringId && fav.offeringId.mentorId?.userId ? (
              <Link
                key={fav._id}
                to={`/mentores/${fav.offeringId.mentorId.userId}`}
                className="mentee-profile_favorite-card"
              >
                <h4>{fav.offeringId.title}</h4>
                <span>{fav.offeringId.area}</span>
                <p>{fav.offeringId.sessionPrice}€</p>
              </Link>
            ) : (
              <div
                key={fav._id}
                className="mentee-profile_favorite-card mentee-profile_favorite-card--unavailable"
              >
                <h4>Oferta indisponível</h4>
                <p>Esta oferta já não existe.</p>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}
