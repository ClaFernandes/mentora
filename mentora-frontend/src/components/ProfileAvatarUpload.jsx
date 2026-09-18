import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { uploadImage } from "../services/uploadService.js";
import { updateAvatar } from "../services/userService.js";
import Avatar from "./Avatar.jsx";
import { FiCamera, FiTrash2 } from "react-icons/fi";
import "./ProfileAvatarUpload.css";

export default function ProfileAvatarUpload({ name, surname, avatarUrl, variant }) {
    const { token, setUser } = useAuth();
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);

    const avatarInputRef = useRef(null);
    const avatarMenuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) {
                setShowAvatarMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleAvatarChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingAvatar(true);
        try {
            const uploadResult = await uploadImage(token, file);
            await updateAvatar(token, uploadResult.url);
            setUser((prev) => ({ ...prev, avatarUrl: uploadResult.url }));
        } finally {
            setUploadingAvatar(false);
            setShowAvatarMenu(false);
        }
    }

    async function handleRemoveAvatar() {
        setUploadingAvatar(true);
        try {
            await updateAvatar(token, "");
            setUser((prev) => ({ ...prev, avatarUrl: "" }));
        } finally {
            setUploadingAvatar(false);
            setShowAvatarMenu(false);
        }
    }

    const wrapperClass = `${variant}-profile_avatar-wrapper`;
    const badgeClass = `${variant}-profile_avatar-badge`;
    const menuClass = `${variant}-profile_avatar-menu`;
    const menuDangerClass = `${variant}-profile_avatar-menu-danger`;

    return (
        <div className={wrapperClass} ref={avatarMenuRef}>
            <Avatar src={avatarUrl} name={name} surname={surname} size={80} />
            <button
                type="button"
                className={badgeClass}
                onClick={() => setShowAvatarMenu((prev) => !prev)}
                disabled={uploadingAvatar}
                aria-label="Opções de foto de perfil"
            >
                <FiCamera />
            </button>

            {showAvatarMenu && (
                <div className={menuClass}>
                    <button type="button" onClick={() => avatarInputRef.current.click()}>
                        <FiCamera /> Carregar foto
                    </button>
                    {avatarUrl && (
                        <button type="button" className={menuDangerClass} onClick={handleRemoveAvatar}>
                            <FiTrash2 /> Remover foto
                        </button>
                    )}
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                style={{ display: "none" }}
                onChange={handleAvatarChange}
            />
        </div>
    );
}