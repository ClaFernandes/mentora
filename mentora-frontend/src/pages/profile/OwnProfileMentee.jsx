import ProfileAvatarUpload from "../../components/ProfileAvatarUpload.jsx";
import ChangePasswordSection from "../../components/ChangePasswordSection.jsx";
import DangerZoneSection from "../../components/DangerZoneSection.jsx";
import MenteeBioSection from "./MenteeBioSection.jsx";
import MenteeInterestsSection from "./MenteeInterestsSection.jsx";
import MenteeFollowedMentors from "./MenteeFollowedMentors.jsx";
import MenteeFavoriteOfferings from "./MenteeFavoriteOfferings.jsx";
import "./MenteeProfile.css";
import "../mentors/MentorsPage.css";

export default function OwnProfileMentee({ mentee }) {
  return (
    <div className="mentee-profile">
      <header className="mentee-profile_header">
        <ProfileAvatarUpload
          name={mentee.name}
          surname={mentee.surname}
          avatarUrl={mentee.avatarUrl}
          variant="mentee"
        />

        <div className="mentee-profile_header-info">
          <h2>{mentee.name} {mentee.surname}</h2>
        </div>
      </header>

      <MenteeBioSection bio={mentee.bio} />

      <MenteeInterestsSection interests={mentee.menteeProfile?.interests} />

      <MenteeFollowedMentors followingMentors={mentee.menteeProfile.followingMentors} />

      <MenteeFavoriteOfferings />

      <ChangePasswordSection variant="mentee" />

      <DangerZoneSection variant="mentee" />
    </div>
  );
}