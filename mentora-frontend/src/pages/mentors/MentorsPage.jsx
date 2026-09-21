import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Avatar from "../../components/Avatar.jsx";
import { searchMentors } from "../../services/mentorService.js";
import { followMentor, unfollowMentor } from "../../services/followService.js";
import { MENTORSHIP_AREAS } from "../../utils/constants.js";
import { AiFillStar } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { FiSearch, FiCheck, FiPlus, FiX } from "react-icons/fi";
import "./MentorsPage.css";

const RATING_OPTIONS = [
    { value: 0, label: "Todos" },
    { value: 4, label: "4+" },
    { value: 4.5, label: "4.5+" },
];

const PAGE_SIZE = 6;

export default function MentorsPage() {
    const { user, updateUser, token } = useAuth();
    const [searchParams] = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
    const [selectedArea, setSelectedArea] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState("rating");
    const [mentors, setMentors] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function loadMentors(pageToLoad) {
        setLoading(true);
        setError(null);

        const filters = {
            area: selectedArea,
            minPrice,
            maxPrice,
            minRating: minRating || undefined,
            q: searchQuery,
            sortBy,
        };

        try {
            const result = await searchMentors(filters, pageToLoad, PAGE_SIZE);

            if (pageToLoad === 1) {
                setMentors(result.mentors);
            } else {
                setMentors((prev) => [...prev, ...result.mentors]);
            }

            setPage(result.page);
            setTotalPages(result.totalPages);
        } catch {
            setError("Não foi possível carregar os mentores. Tenta novamente.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMentors(1);
    }, [searchQuery, selectedArea, minPrice, maxPrice, minRating, sortBy]);

    const hasActiveFilters =
        searchQuery !== "" || selectedArea !== "" || minPrice !== "" || maxPrice !== "" || minRating !== 0;

    function clearFilters() {
        setSearchQuery("");
        setSelectedArea("");
        setMinPrice("");
        setMaxPrice("");
        setMinRating(0);
    }

    async function toggleFollow(mentorId, e) {
        e.preventDefault();
        e.stopPropagation();

        const following = user.menteeProfile?.followingMentors || [];
        const isFollowing = following.includes(mentorId);

        setError(null);

        try {
            if (isFollowing) {
                await unfollowMentor(token, mentorId);
            } else {
                await followMentor(token, mentorId);
            }

            const updated = isFollowing
                ? following.filter((id) => id !== mentorId)
                : [...following, mentorId];

            updateUser({
                menteeProfile: { ...user.menteeProfile, followingMentors: updated },
            });
        } catch {
            setError("Não foi possível atualizar o seguimento. Tenta novamente.");
        }
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

            {error && <p className="mentors-empty">{error}</p>}

            <div className="mentors-grid">
                {mentors.length === 0 && !loading ? (
                    !error && <p className="mentors-empty">Nenhum mentor encontrado com esses filtros.</p>
                ) : (
                    mentors.map((mentor) => (
                        <Link key={mentor._id} to={`/mentores/${mentor.userId._id}`} className="mentors-card">
                            {user.role === "mentee" && (
                                <button
                                    type="button"
                                    className="mentors-card-follow"
                                    onClick={(e) => toggleFollow(mentor.userId._id, e)}
                                >
                                    {user.menteeProfile?.followingMentors?.includes(mentor.userId._id) ? <FiCheck /> : <FiPlus />}
                                </button>
                            )}
                            <Avatar src={mentor.userId.avatarUrl} name={mentor.userId.name} surname={mentor.userId.surname} size={64} />
                            <h3>{mentor.userId.name} {mentor.userId.surname}
                                {mentor.isVerified && (
                                    <FaCheckCircle className="mentors-card-verified" title="Mentor verificado" />
                                )}
                            </h3>
                            <p className="mentors-card-offering">{mentor.offerings[0]?.title}</p>
                            <p className="mentors-card-rating">
                                <AiFillStar /> {mentor.avgRating}
                            </p>
                            <p className="mentors-card-price">
                                {mentor.offerings.length > 0
                                    ? `${Math.min(...mentor.offerings.map((o) => o.sessionPrice))}€`
                                    : ""}
                            </p>
                        </Link>
                    ))
                )}
            </div>

            {page < totalPages && (
                <button
                    type="button"
                    className="mentors-load-more"
                    onClick={() => loadMentors(page + 1)}
                    disabled={loading}
                >
                    {loading ? "A carregar..." : "Carregar mais"}
                </button>
            )}
        </div>
    );
}