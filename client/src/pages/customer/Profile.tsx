import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

interface Customer {
    customer_id: number;
    name: string;
    email: string;
    username: string;
    password?: string;
}

interface CustomerOrder {
    transaction_id: number;
    cost: number;
    time: string;
}

function OrderHistory() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<CustomerOrder[]>([]);

    const API_BASE = import.meta.env.VITE_API_BASE;

    useEffect(() => {
        if (!user) return;
        loadOrders();
    }, [user]);

    async function loadOrders() {
        const res = await fetch(`${API_BASE}/api/customers/${user!.id}/orders`);
        const data = await res.json();
        setOrders(data);
    }

    return (
        <div className="order-history">
            <h2>Past Orders</h2>

            {orders.length === 0 && <p>No past orders.</p>}

            <ul>
                {orders.map((order) => (
                    <li key={order.transaction_id}>
                        <strong>Order #{order.transaction_id}</strong> — ${order.cost.toFixed(2)}  
                        <br />
                        <span>{new Date(order.time).toLocaleString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}


function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Customer | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const API_BASE = import.meta.env.VITE_API_BASE;

    useEffect(() => {
        if (!user) return;
        loadProfile();
    }, [user]);

    async function loadProfile() {
        const res = await fetch(`${API_BASE}/api/customers/${user!.id}`);
        const data = await res.json();
        setProfile(data);
    }

    async function saveChanges() {
        if (!profile) return;

        const res = await fetch(`${API_BASE}/api/customers/${user!.id}`, {
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
            <h1>Customer Profile</h1>

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

                <label>Username:</label>
                {isEditing ? (
                    <input
                        value={profile.username}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    />
                ) : (
                    <p>{profile.username}</p>
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
            </div>

            {isEditing ? (
                <>
                    <button className="save-btn" onClick={saveChanges}>Save</button>
                    <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            ) : (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}

            <OrderHistory />
        </div>
    );
}

export default Profile;
