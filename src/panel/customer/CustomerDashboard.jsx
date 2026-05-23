import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style-4.css';
import '../../css/style.css';

import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

/* ─── Google Font ─────────────────────────────────────────── */
const FontLink = () => (
    <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
        rel="stylesheet"
    />
);

/* ─── Icons ───────────────────────────────────────────────── */
const IconBell = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);
const IconBag = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
);
const IconMoney = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
);
const IconStar = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);
const IconClock = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);
const IconHome = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);
const IconOffice = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
);
const IconCart = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6" />
    </svg>
);
const IconPin = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);
const IconHeart = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);
const IconSupport = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
    </svg>
);

/* ─── Styles ──────────────────────────────────────────────── */
const s = {
    page: { background: "#faf9f7", minHeight: "100vh", padding: "28px 20px", fontFamily: "'Nunito', sans-serif" },
    topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" },
    brand: { display: "flex", alignItems: "center", gap: "10px" },
    brandDot: { width: "10px", height: "10px", borderRadius: "50%", background: "#e8820c" },
    brandName: { fontSize: "20px", fontWeight: "900", color: "#1a1a1a", letterSpacing: "-0.5px" },
    notifBtn: { width: "36px", height: "36px", borderRadius: "10px", border: "1.5px solid #e8e4dc", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" },
    notifDot: { position: "absolute", top: "7px", right: "7px", width: "7px", height: "7px", background: "#e8820c", borderRadius: "50%", border: "1.5px solid #fff" },
    avatar: { width: "36px", height: "36px", borderRadius: "10px", background: "#e8820c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "900", color: "#fff" },
    greetSub: { fontSize: "12px", fontWeight: "700", letterSpacing: "0.8px", textTransform: "uppercase", color: "#e8820c", marginBottom: "4px" },
    greetName: { fontSize: "24px", fontWeight: "900", color: "#1a1a1a", letterSpacing: "-0.5px" },
    greetMsg: { fontSize: "13px", color: "#999", fontWeight: "600", marginTop: "2px" },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" },
    statCard: { background: "#fff", borderRadius: "16px", border: "1px solid #ece9e3", padding: "16px 18px" },
    statIconBase: { width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" },
    statVal: { fontSize: "22px", fontWeight: "900", color: "#1a1a1a", letterSpacing: "-0.5px" },
    statLabel: { fontSize: "11px", fontWeight: "700", letterSpacing: "0.6px", textTransform: "uppercase", color: "#bbb", marginTop: "2px" },
    promoRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" },
    twoCol: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px", marginBottom: "20px" },
    card: { background: "#fff", borderRadius: "18px", border: "1px solid #ece9e3", overflow: "hidden" },
    cardHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f5f3ef" },
    cardTitle: { fontSize: "13px", fontWeight: "800", letterSpacing: "0.5px", textTransform: "uppercase", color: "#1a1a1a" },
    cardLink: { fontSize: "12px", fontWeight: "700", color: "#e8820c", cursor: "pointer", textDecoration: "none" },
    orderRow: { display: "flex", alignItems: "center", gap: "12px", padding: "13px 20px", borderBottom: "1px solid #f9f7f4" },
    orderImg: { width: "42px", height: "42px", borderRadius: "10px", background: "#fef3e2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 },
    orderName: { fontSize: "13px", fontWeight: "800", color: "#1a1a1a" },
    orderDate: { fontSize: "11px", color: "#aaa", fontWeight: "600", marginTop: "2px" },
    orderPrice: { fontSize: "14px", fontWeight: "900", color: "#1a1a1a" },
    addrIcon: { width: "34px", height: "34px", borderRadius: "9px", background: "#fef3e2", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8820c", flexShrink: 0 },
    addrLabel: { fontSize: "10px", fontWeight: "800", letterSpacing: "0.7px", textTransform: "uppercase", color: "#e8820c", marginBottom: "3px" },
    addrText: { fontSize: "13px", fontWeight: "700", color: "#1a1a1a", lineHeight: "1.4" },
    bottomRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
    quickGrid: { display: "grid", gridTemplateColumns: "1fr 1fr" },
    quickItem: { padding: "14px 18px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", borderRight: "1px solid #f5f3ef", borderBottom: "1px solid #f5f3ef", cursor: "pointer" },
    quickIco: { width: "38px", height: "38px", borderRadius: "12px", background: "#fef3e2", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8820c" },
    quickLabel: { fontSize: "12px", fontWeight: "800", color: "#1a1a1a", textAlign: "center" },
};

const badgeStyle = (status) => {
    const map = {
        Delivered: { background: "#e6f4ea", color: "#1a5c28" },
        Processing: { background: "#fff3e0", color: "#7c3e00" },
        Cancelled: { background: "#fef3e2", color: "#7a3600" },
    };
    return {
        display: "inline-block", padding: "3px 9px", borderRadius: "20px",
        fontSize: "10px", fontWeight: "800", letterSpacing: "0.5px",
        textTransform: "uppercase", marginTop: "3px",
        ...(map[status] || {}),
    };
};

/* ─── Static mock data (swap with real API calls) ─────────── */
const MOCK_ORDERS = [
    { id: "AK8834", name: "Whole Kampung Chicken (1kg)", date: "20 May 2026", price: "RM 28", status: "Processing", emoji: "🍗" },
    { id: "AK8821", name: "Ayam Goreng Cut (500g)", date: "18 May 2026", price: "RM 22", status: "Delivered", emoji: "🍗" },
    { id: "AK8790", name: "Chicken Rendang Cut (400g)", date: "15 May 2026", price: "RM 35", status: "Delivered", emoji: "🍗" },
    { id: "AK8751", name: "Chicken Satay Strips (300g)", date: "10 May 2026", price: "RM 18", status: "Cancelled", emoji: "🍗" },
];

const STATS = [
    { label: "Total Orders", val: "24", icon: <IconBag />, bg: "#fef3e2", color: "#e8820c" },
    { label: "Total Spent", val: "RM 580", icon: <IconMoney />, bg: "#e6f4ea", color: "#1e7e34" },
    { label: "Avg Rating", val: "4.8", icon: <IconStar />, bg: "#fff3e0", color: "#e65100" },
    { label: "Loyalty Pts", val: "620", icon: <IconClock />, bg: "#e3f0fb", color: "#1565c0" },
];

const QUICK = [
    { label: "Order Again", icon: <IconCart /> },
    { label: "Track Order", icon: <IconPin /> },
    { label: "Favourites", icon: <IconHeart /> },
    { label: "Support", icon: <IconSupport /> },
];

/* ─── Component ───────────────────────────────────────────── */
function CustomerDashboard() {
    const { user } = useAuth();
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [userName, setUserName] = useState("Customer");

    /* Fetch real user name */
    useEffect(() => {
        if (!user?.id) return;
        (async () => {
            try {
                const res = await fetch(`${API}/api/getuserdetailsbyuid`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ uid: user.id }),
                });
                const data = await res.json();
                if (data?.name) setUserName(data.name);
            } catch (e) { console.error(e); }
        })();
    }, [user?.id]);

    /* Fetch real orders — replace MOCK_ORDERS once API is ready */
    useEffect(() => {
        if (!user?.id) return;
        // (async () => {
        //   const res = await fetch(`${API}/api/getordersbyuid`, { method: "POST", ... });
        //   const data = await res.json();
        //   setOrders(data);
        // })();
    }, [user?.id]);

    const initials = userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    return (
        <>
            <FontLink />
            <div style={s.page}>

                {/* ── TOP BAR ── */}
                <div style={s.topbar}>
                    <div style={s.brand}>
                        <div style={s.brandDot} />
                        <div style={s.brandName}>
                            tender<span style={{ color: "#e8820c" }}>cuts</span>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={s.notifBtn}>
                            <IconBell />
                            <div style={s.notifDot} />
                        </div>
                        <div style={s.avatar}>{initials}</div>
                    </div>
                </div>

                {/* ── GREETING ── */}
                <div style={{ marginBottom: "24px" }}>
                    <div style={s.greetSub}>{greeting}</div>
                    <div style={s.greetName}>{userName}</div>
                    <div style={s.greetMsg}>Fresh halal chicken ready for delivery today</div>
                </div>

                {/* ── STATS ── */}
                <div style={s.statsGrid}>
                    {STATS.map(({ label, val, icon, bg, color }) => (
                        <div key={label} style={s.statCard}>
                            <div style={{ ...s.statIconBase, background: bg, color }}>{icon}</div>
                            <div style={s.statVal}>{val}</div>
                            <div style={s.statLabel}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* ── PROMO BANNERS ── */}
                <div style={s.promoRow}>
                    {[
                        { bg: "#e8820c", eyebrow: "Weekend Special", title: "20% off Ayam Goreng", sub: "Use code KINI20 at checkout", ctaBg: "#fff", ctaColor: "#e8820c" },
                        { bg: "#1a1a1a", eyebrow: "New Arrival", title: "New: Kampung Chicken", sub: "Free-range, hormone-free cuts", ctaBg: "#e8820c", ctaColor: "#fff" },
                    ].map(({ bg, eyebrow, title, sub, ctaBg, ctaColor }) => (
                        <div key={title} style={{ background: bg, borderRadius: "16px", padding: "18px 20px", position: "relative", overflow: "hidden", cursor: "pointer" }}>
                            <div style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "6px" }}>{eyebrow}</div>
                            <div style={{ fontSize: "16px", fontWeight: "900", color: "#fff", letterSpacing: "-0.3px", lineHeight: "1.2" }}>{title}</div>
                            <div style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.65)", marginTop: "4px" }}>{sub}</div>
                            <div style={{ display: "inline-block", marginTop: "12px", background: ctaBg, color: ctaColor, fontSize: "12px", fontWeight: "800", padding: "6px 14px", borderRadius: "8px" }}>Shop Now</div>
                            <div style={{ position: "absolute", right: "-16px", bottom: "-16px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                        </div>
                    ))}
                </div>

                {/* ── ORDERS + ADDRESS ── */}
                <div style={s.twoCol}>

                    {/* Recent Orders */}
                    <div style={s.card}>
                        <div style={s.cardHead}>
                            <div style={s.cardTitle}>Recent Orders</div>
                            <a style={s.cardLink}>View all</a>
                        </div>
                        {orders.map((o) => (
                            <div key={o.id} style={{ ...s.orderRow, borderBottom: o.id === orders[orders.length - 1].id ? "none" : "1px solid #f9f7f4" }}>
                                <div style={s.orderImg}>{o.emoji}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={s.orderName}>{o.name}</div>
                                    <div style={s.orderDate}>{o.date} · {o.id}</div>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                    <div style={s.orderPrice}>{o.price}</div>
                                    <div style={badgeStyle(o.status)}>{o.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Saved Addresses */}
                    <div style={s.card}>
                        <div style={s.cardHead}>
                            <div style={s.cardTitle}>Saved Addresses</div>
                            <a style={s.cardLink}>Add new</a>
                        </div>
                        <div style={{ padding: "8px 20px" }}>
                            {[
                                { icon: <IconHome />, label: "Home", text: "12, Jalan Bukit Bintang, KL — 55100", isDefault: true },
                                { icon: <IconOffice />, label: "Office", text: "Level 3, Menara KL, KLCC — 50088", isDefault: false },
                            ].map(({ icon, label, text, isDefault }) => (
                                <div key={label} style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: isDefault ? "1px solid #f5f3ef" : "none" }}>
                                    <div style={s.addrIcon}>{icon}</div>
                                    <div>
                                        <div style={s.addrLabel}>{label}</div>
                                        <div style={s.addrText}>{text}</div>
                                        {isDefault && (
                                            <div style={{ display: "inline-block", background: "#fef3e2", color: "#7a3600", fontSize: "10px", fontWeight: "800", padding: "2px 8px", borderRadius: "20px", marginTop: "4px" }}>Default</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* ── LOYALTY + QUICK ACTIONS ── */}
                <div style={s.bottomRow}>

                    {/* Loyalty */}
                    <div style={s.card}>
                        <div style={{ background: "#1a1a1a", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.8px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Loyalty Points</div>
                                <div style={{ fontSize: "22px", fontWeight: "900", color: "#fff", letterSpacing: "-0.5px" }}>620 <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: "700" }}>pts</span></div>
                            </div>
                            <IconStar />
                        </div>
                        <div style={{ padding: "16px 20px" }}>
                            <div style={{ fontSize: "12px", fontWeight: "700", color: "#555" }}>Progress to Gold Tier</div>
                            <div style={{ height: "8px", background: "#f0ede8", borderRadius: "20px", margin: "10px 0" }}>
                                <div style={{ height: "8px", background: "#e8820c", borderRadius: "20px", width: "62%" }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "700", color: "#bbb" }}>
                                <span>620 pts</span><span style={{ color: "#1a1a1a" }}>1000 pts</span>
                            </div>
                            <div style={{ marginTop: "14px" }}>
                                {[
                                    { text: "Free delivery on all orders", unlocked: true },
                                    { text: "Early access to weekend deals", unlocked: true },
                                    { text: "Priority customer support", unlocked: false },
                                ].map(({ text, unlocked }) => (
                                    <div key={text} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 0", borderBottom: "1px solid #f5f3ef", fontSize: "12px", fontWeight: "700", color: unlocked ? "#555" : "#bbb" }}>
                                        <div style={{ width: "20px", height: "20px", borderRadius: "6px", background: unlocked ? "#e6f4ea" : "#f5f3ef", display: "flex", alignItems: "center", justifyContent: "center", color: unlocked ? "#1e7e34" : "#ccc", fontSize: "11px", flexShrink: 0 }}>
                                            {unlocked ? "✓" : "—"}
                                        </div>
                                        {text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={s.card}>
                        <div style={s.cardHead}><div style={s.cardTitle}>Quick Actions</div></div>
                        <div style={s.quickGrid}>
                            {QUICK.map(({ label, icon }, i) => (
                                <div
                                    key={label}
                                    style={{
                                        ...s.quickItem,
                                        borderRight: i % 2 === 0 ? "1px solid #f5f3ef" : "none",
                                        borderBottom: i < 2 ? "1px solid #f5f3ef" : "none",
                                    }}
                                >
                                    <div style={s.quickIco}>{icon}</div>
                                    <div style={s.quickLabel}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}

export default CustomerDashboard;
