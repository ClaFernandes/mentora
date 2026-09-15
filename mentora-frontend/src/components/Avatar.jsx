import "./Avatar.css";

function getInitials(name, surname) {
    const first = name?.[0] || "";
    const last = surname?.[0] || "";
    if (!first && !last) return "?";
    return (first + last).toUpperCase();
}

export default function Avatar({ src, name, surname, size = 36 }) {
    const initials = getInitials(name, surname);
    const fullName = surname ? `${name} ${surname}` : name;

    if (src) {
        return (
            <img
                src={src}
                alt={fullName}
                className="avatar"
                style={{ width: size, height: size }}
            />
        );
    }

    return (
        <div className="avatar avatar_fallback" style={{ width: size, height: size }}>
            {initials}
        </div>
    );
}