
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

interface OrderDish {
    dish_id: number;
    name: string;
    price: number;
}

interface CustomerOrder {
    transaction_id: number;
    cost: number;
    time: string;
    dishes: OrderDish[];
}
function OrderHistory() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<CustomerOrder[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const API_BASE = import.meta.env.VITE_API_BASE;

    useEffect(() => {
        if (!user) return;
        loadOrders();
    }, [user]);

    async function loadOrders() {
        const res = await fetch(`${API_BASE}/api/customers/${user!.id}/orders`);
        const data = await res.json();
        setOrders(data);
        if (data.length > 0) {
            setSelectedId(data[0].transaction_id);
        }
    }

    const selectedOrder = orders.find(
        o => o.transaction_id === selectedId
    );

    return (
        <div className="order-history">
            <h2>Past Orders</h2>

            {orders.length === 0 && <p>No past orders.</p>}

            {orders.length > 0 && (
                <>
                    <select
                        className="order-select"
                        value={selectedId ?? ""}
                        onChange={(e) => setSelectedId(Number(e.target.value))}
                    >
                        {orders.map(order => (
                            <option
                                key={order.transaction_id}
                                value={order.transaction_id}
                            >
                                Order #{order.transaction_id} —{" "}
                                {new Date(order.time).toLocaleString()}
                            </option>
                        ))}
                    </select>
                    {selectedOrder && (
                        <div className="order-receipt">
                            <ul className="dish-list">
                                {selectedOrder.dishes.map(dish => (
                                    <li key={dish.dish_id} className="dish-line">
                                        <span>{dish.name}</span>
                                        <span>${dish.price.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="order-total">
                                Total: ${selectedOrder.cost.toFixed(2)}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Customer | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmPass, setConfirmPass] = useState('');

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

        const newPassword = profile.password?.trim();

        if(!newPassword || newPassword.length === 0){
            alert('Password required to save changes.');
            return;
        }
        
        if(newPassword.length < 6){
            alert('Password must be at least 6 characters long.');
            return;
        }

        if(newPassword !== confirmPass){
            alert('Password and conformation password do not match.');
            return;
        }

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

            <OrderHistory />
        </div>
    );
}

export default Profile;
