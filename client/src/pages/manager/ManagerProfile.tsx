import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../customer/Profile.css";

interface Manager {
    employee_id: number;
    name: string;
    email: string;
    password?: string;
}

function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Manager | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmPass, setConfirmPass] = useState('');

    const API_BASE = import.meta.env.VITE_API_BASE;

    useEffect(() => {
        if (!user) return;
        loadProfile();
    }, [user]);

    async function loadProfile() {
        const res = await fetch(`${API_BASE}/api/employees/${user!.id}`);
        const data = await res.json();
        setProfile(data);
    }

    async function saveChanges() {
        if (!profile) return;

        const newPassword = profile.password?.trim();

        if(!newPassword || newPassword.length === 0){
            alert('Password required to save changes.');
            return;
        }

        if(profile.password.length < 6){
            alert('Password must be at least 6 characters long.');
            return;
        }

        if(newPassword !== confirmPass){
            alert('Password and conformation password do not match.');
            return;
        }

        const res = await fetch(`${API_BASE}/api/employees/${user!.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profile),
        });

        const updated = await res.json();
        setProfile(updated);
        setIsEditing(false);
        alert("Profile updated!");
    }

    if (!user) return <h2>You must be logged in</h2>;
    if (!profile) return <h2>Loading...</h2>;

    return (
        <div className="profile-page">
            <h1>Manager Profile</h1>

            <div className="profile-box">
                <label>Name:</label>
                {isEditing ? (
                    <input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                ) : (
                    <p>{profile.name}</p>
                )}

                <label>Email:</label>
                {isEditing ? (
                    <input
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                ) : (
                    <p>{profile.email}</p>
                )}

                <label>Password:</label>
                {isEditing ? (
                    <input
                        type="password"
                        onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    />
                ) : (
                    <p>********</p>
                )}

                <label>Confirm Password:</label>
                {isEditing ? (
                    <input
                        type="password"
                        onChange={(e) => setConfirmPass(e.target.value)}
                    />
                ) : (
                    <p>********</p>
                )}
            </div>

            {isEditing ? (
                <>
                    <button className="save-btn" onClick={saveChanges}>Save</button>
                    <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            ) : (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
        </div>
    );
}

export default Profile;
