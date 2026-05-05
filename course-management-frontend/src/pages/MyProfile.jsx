import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import studentService from "../services/studentService";
import instructorService from "../services/instructorService";
import { Link } from "react-router-dom";

function MyProfile() {
  const { role } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const service = role === "Student" ? studentService : instructorService;
      const data = await service.getMyProfile();
      setProfile(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-card">
          <p className="info">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-card">
        <div className="section-header">
          <h1>My Profile</h1>
          <Link to={role === "Student" ? "/create-student-profile" : "/create-instructor-profile"} className="button small secondary">
            Edit Profile
          </Link>
        </div>

        {error ? (
          <p className="error">{error}</p>
        ) : profile ? (
          <div className="user-info-grid" style={{ fontSize: '18px', maxWidth: '500px' }}>
            <div>
              <strong>Full Name:</strong> 
              <span>{profile.fullName || profile.name || profile.username || 'N/A'}</span>
            </div>
            <div>
              <strong>Email:</strong> 
              <span>{profile.email || 'N/A'}</span>
            </div>
            <div>
              <strong>Role:</strong> 
              <span>{role}</span>
            </div>
            {profile.phone && (
              <div>
                <strong>Phone:</strong> 
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.bio && (
              <div>
                <strong>Bio:</strong> 
                <span>{profile.bio}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="info">No profile found. <Link to={role === "Student" ? "/create-student-profile" : "/create-instructor-profile"}>Create your profile</Link></p>
        )}
      </div>
    </div>
  );
}

export default MyProfile;
