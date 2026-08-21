import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Avatar from "../../components/Avatar.jsx";
import { MOCK_MENTORS } from "../../mocks/mockData.js";
import { MENTORSHIP_AREAS } from "../../utils/constants.js";
import { AiFillStar } from "react-icons/ai";
import { FiSearch, FiCheck, FiPlus, FiX } from "react-icons/fi";
import "./MentorsPage.css";

const RATING_OPTIONS = [
    { value: 0, label: "Todos" },
    { value: 4, label: "4+" },
    { value: 4.5, label: "4.5+" },
];

// Quando tiver backend, trocar por paginação por cursor (?cursor=&limit=), carregando cada página via API em vez de um array local
const PAGE_SIZE = 6;

function getPriceRange(offerings) {
    const prices = offerings.map((o) => o.sessionPrice);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `${min}€` : `${min}€–${max}€`;
}

export default function MentorsPage() {
    const { user, updateUser } = useAuth();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState("rating");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [searchQuery, selectedArea, minPrice, maxPrice, minRating, sortBy]);

    function mentorMatchesFilters(mentor) {
        const matchesArea =
            selectedArea === "" ||
            (selectedArea === "Outras"
                ? mentor.offerings.some((o) => !MENTORSHIP_AREAS.includes(o.area))
                : mentor.offerings.some((o) => o.area === selectedArea));

        const matchesSearch =
            searchQuery.trim() === "" ||
            mentor.offerings.some((o) =>
                o.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
            );

        const matchesPrice = mentor.offerings.some((o) => {
            const aboveMin = minPrice === "" || o.sessionPrice >= Number(minPrice);
            const belowMax = maxPrice === "" || o.sessionPrice <= Number(maxPrice);
            return aboveMin && belowMax;
        });

        const matchesRating = mentor.avgRating >= minRating;

        return matchesArea && matchesSearch && matchesPrice && matchesRating;
    }

    const filteredMentors = MOCK_MENTORS.filter(mentorMatchesFilters).sort((a, b) => {
        if (sortBy === "priceAsc") {
            return Math.min(...a.offerings.map((o) => o.sessionPrice)) -
                Math.min(...b.offerings.map((o) => o.sessionPrice));
        }
        return b.avgRating - a.avgRating; // "rating" — do mais bem avaliado
    });

    const visibleMentors = filteredMentors.slice(0, visibleCount);
    const hasMore = visibleCount < filteredMentors.length;

    const hasActiveFilters =
        searchQuery !== "" || selectedArea !== "" || minPrice !== "" || maxPrice !== "" || minRating !== 0;

    function clearFilters() {
        setSearchQuery("");
        setSelectedArea("");
        setMinPrice("");
        setMaxPrice("");
        setMinRating(0);
    }

    function toggleFollow(mentorId, e) {
        e.preventDefault();
        e.stopPropagation();
        const following = user.menteeProfile?.followingMentors || [];
        const updated = following.includes(mentorId)
            ? following.filter((id) => id !== mentorId)
            : [...following, mentorId];
        updateUser({
            menteeProfile: { ...user.menteeProfile, followingMentors: updated },
        });
    }

    return (
        <div className="container">
            <div className="mentors-filters">
                <div className="mentors-filters-row">
                    <div className="mentors-search">
                        <FiSearch className="mentors-search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por título de mentoria..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                    >
                        <option value="">Todas as áreas</option>
                        {MENTORSHIP_AREAS.map((area) => (
                            <option key={area} value={area}>{area}</option>
                        ))}
                        <option value="Outras">Outras</option>
                    </select>
                </div>

                <div className="mentors-filters-row">
                    <div className="mentors-price-inputs">
                        <input
                            type="number"
                            min="0"
                            placeholder="Mín. €"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <span>—</span>
                        <input
                            type="number"
                            min="0"
                            placeholder="Máx. €"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>

                    <div className="mentors-rating-pills">
                        {RATING_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={minRating === option.value ? "mentors-rating-pill active" : "mentors-rating-pill"}
                                onClick={() => setMinRating(option.value)}
                            >
                                {option.label}
                                {option.value > 0 && <AiFillStar className="mentors-rating-pill-icon" />}
                            </button>
                        ))}
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="mentors-sort"
                    >
                        <option value="rating">Melhor avaliação</option>
                        <option value="priceAsc">Menor preço</option>
                    </select>

                    {hasActiveFilters && (
                        <button type="button" className="mentors-clear-btn" onClick={clearFilters}>
                            <FiX /> Limpar filtros
                        </button>
                    )}
                </div>
            </div>

            <div className="mentors-grid">
                {filteredMentors.length === 0 ? (
                    <p className="mentors-empty">Nenhum mentor encontrado com esses filtros.</p>
                ) : (
                    visibleMentors.map((mentor) => (
                        <Link key={mentor.id} to={`/mentores/${mentor.id}`} className="mentors-card">
                            {user.role === "mentee" && (
                                <button
                                    type="button"
                                    className="mentors-card-follow"
                                    onClick={(e) => toggleFollow(mentor.id, e)}
                                >
                                    {user.menteeProfile?.followingMentors?.includes(mentor.id) ? <FiCheck /> : <FiPlus />}
                                </button>
                            )}
                            <Avatar src={mentor.avatarUrl} name={mentor.name} size={64} />
                            <h3>{mentor.name}</h3>
                            <p className="mentors-card-offering">{mentor.offerings[0].title}</p>
                            <p className="mentors-card-rating">
                                <AiFillStar /> {mentor.avgRating}
                            </p>
                            <p className="mentors-card-price">
                                {getPriceRange(mentor.offerings)}
                            </p>
                        </Link>
                    ))
                )}
            </div>

            {hasMore && (
                <button
                    type="button"
                    className="mentors-load-more"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                >
                    Carregar mais
                </button>
            )}

        </div>
    );
}