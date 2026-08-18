import "./Avatar.css";
function getInitials(name) {
    if (!name) return "?";
    const stop = new Set(["do", "da", "de", "dos", "das", "e", "o", "a"]);
    const words = name.trim().split(/\s+/).filter((w) => !stop.has(w.toLowerCase()));
    if (words.length === 0) return name.slice(0, 2).toUpperCase();
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
}

export default function Avatar({ src, name, size = 36 }) {
    const initials = getInitials(name);

    if (src) {
        return (
            <img
                src={src}
                alt={name}
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