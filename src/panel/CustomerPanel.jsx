import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import PersonalDetails from "./customer/PersonalDetails";
import OrderStatus from "./customer/OrderStatus";
import CustomerOrderHistory from "./customer/CustomerOrderHistory";

/* ─────────────────────────────────────────
   AYAM KINI CUSTOMER PANEL
───────────────────────────────────────── */

const C = {
  primary: "#e53935",
  primaryDark: "#c62828",

  accent: "#ffb300",

  bg: "#f5f7fb",
  surface: "#ffffff",

  border: "#e8edf3",

  text: "#111827",
  textSoft: "#6b7280",
  textMuted: "#9ca3af",
};

const S = {
  root: {
    minHeight: "100vh",
    background: `
      radial-gradient(circle at top left, rgba(229,57,53,0.08), transparent 25%),
      radial-gradient(circle at bottom right, rgba(255,179,0,0.08), transparent 30%),
      ${C.bg}
    `,
    fontFamily: "'Poppins', sans-serif",
    color: C.text,
  },

  /* HEADER */

  header: {
    height: 74,
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(10px)",
    borderBottom: `1px solid ${C.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  brandWrap: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  logo: {
    width: 46,
    height: 46,
    borderRadius: 14,
    background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 900,
    fontSize: 15,
    boxShadow: "0 8px 20px rgba(229,57,53,0.25)",
  },

  brandTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: C.text,
  },

  brandSub: {
    fontSize: 11,
    color: C.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 2,
  },

  userPill: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#fff",
    border: `1px solid ${C.border}`,
    borderRadius: 40,
    padding: "6px 14px 6px 6px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${C.accent}, #ff9800)`,
    color: "#2d1b00",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 13,
  },

  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: C.text,
  },

  /* HERO */

  hero: {
    margin: 24,
    background: `
      linear-gradient(135deg, #ffffff, #fff6f6)
    `,
    border: `1px solid ${C.border}`,
    borderRadius: 30,
    padding: "42px 38px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 12px 35px rgba(0,0,0,0.05)",
  },

  heroGlow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: "50%",
    background: "rgba(229,57,53,0.05)",
    top: -80,
    right: -80,
  },

  heroTitle: {
    fontSize: 34,
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: 12,
    color: C.text,
    position: "relative",
    zIndex: 1,
  },

  heroSub: {
    fontSize: 15,
    lineHeight: 1.8,
    color: C.textSoft,
    maxWidth: 560,
    position: "relative",
    zIndex: 1,
  },

  heroBtns: {
    display: "flex",
    gap: 14,
    marginTop: 28,
    flexWrap: "wrap",
    position: "relative",
    zIndex: 1,
  },

  primaryBtn: {
    background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
    color: "#fff",
    border: "none",
    padding: "13px 20px",
    borderRadius: 14,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(229,57,53,0.22)",
  },

  secondaryBtn: {
    background: "#fff",
    border: `1px solid ${C.border}`,
    color: C.text,
    padding: "13px 20px",
    borderRadius: 14,
    fontWeight: 700,
    cursor: "pointer",
  },

  /* LAYOUT */

  layout: {
    display: "grid",
    gridTemplateColumns: "250px 1fr",
    gap: 22,
    padding: "0 24px 24px",
  },

  /* SIDEBAR */

  sidebar: {
    background: "#fff",
    borderRadius: 24,
    padding: 18,
    border: `1px solid ${C.border}`,
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
    height: "fit-content",
  },

  sideTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: C.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    marginBottom: 16,
  },

  navItem: (active) => ({
    width: "100%",
    border: active
      ? `1px solid rgba(229,57,53,0.15)`
      : "1px solid transparent",
    background: active
      ? "linear-gradient(135deg, rgba(229,57,53,0.08), rgba(255,255,255,1))"
      : "transparent",
    borderRadius: 18,
    padding: 14,
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
    cursor: "pointer",
    transition: "0.2s",
  }),

  navIcon: (active) => ({
    width: 42,
    height: 42,
    borderRadius: 12,
    background: active
      ? `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`
      : "#f3f4f6",
    color: active ? "#fff" : C.text,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    flexShrink: 0,
  }),

  navLabel: (active) => ({
    fontSize: 14,
    fontWeight: 700,
    color: active ? C.primary : C.text,
  }),

  navSub: {
    fontSize: 11,
    color: C.textMuted,
    marginTop: 2,
  },

  /* MAIN */

  main: {
    display: "flex",
    flexDirection: "column",
  },

  /* CONTENT */

  contentCard: {
    background: "#fff",
    borderRadius: 26,
    border: `1px solid ${C.border}`,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
  },

  contentHeader: {
    padding: "24px 28px",
    borderBottom: `1px solid ${C.border}`,
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  contentIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    color: "#fff",
  },

  contentTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: C.text,
  },

  contentSub: {
    fontSize: 12,
    color: C.textMuted,
    marginTop: 3,
  },

  contentBody: {
    padding: 28,
  },

  /* LOGIN */

  loginWrap: {
    minHeight: "100vh",
    background: C.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  loginCard: {
    width: 380,
    background: "#fff",
    borderRadius: 30,
    padding: 42,
    textAlign: "center",
    border: `1px solid ${C.border}`,
    boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
  },

  loginIcon: {
    width: 78,
    height: 78,
    borderRadius: 24,
    background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
    margin: "0 auto 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 36,
    color: "#fff",
  },

  loginTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: C.text,
    marginBottom: 10,
  },

  loginSub: {
    fontSize: 14,
    color: C.textSoft,
    lineHeight: 1.7,
    marginBottom: 28,
  },

  loginBtn: {
    width: "100%",
    background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "14px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(229,57,53,0.2)",
  },
};

const TABS = [
  {
    id: "details",
    label: "Personal Details",
    sub: "Manage your profile information",
    icon: "👤",
    component: <PersonalDetails />,
  },
  {
    id: "status",
    label: "Order Status",
    sub: "Track live delivery orders",
    icon: "📦",
    component: <OrderStatus />,
  },
  {
    id: "history",
    label: "Order History",
    sub: "View previous purchases",
    icon: "🧾",
    component: <CustomerOrderHistory />,
  },
];

export default function CustomerPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("details");

  const activeTabData = TABS.find(
    (t) => t.id === activeTab
  );

  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/user-login-page");
  };

  if (!user) {
    return (
      <div style={S.loginWrap}>
        <div style={S.loginCard}>
          <div style={S.loginIcon}>🍗</div>

          <h1 style={S.loginTitle}>AyamKini</h1>

          <p style={S.loginSub}>
            Fresh chicken delivered quickly and safely
            to your doorstep.
          </p>

          <button
            style={S.loginBtn}
            onClick={() =>
              navigate("/user-login-page")
            }
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.root}>
      {/* HEADER */}

      <header style={S.header}>
        <div style={S.brandWrap}>
          <div style={S.logo}>AK</div>

          <div>
            <div style={S.brandTitle}>AyamKini</div>

            <div style={S.brandSub}>
              Fresh Chicken Delivery
            </div>
          </div>
        </div>

        <div style={S.userPill}>
          <div style={S.avatar}>{initials}</div>

          <div style={S.userName}>
            {user.name || user.email}
          </div>
        </div>
      </header>

      {/* HERO */}

      <section style={S.hero}>
        <div style={S.heroGlow}></div>

        <div style={S.heroTitle}>
          Welcome back,{" "}
          {(user.name || "Customer").split(" ")[0]}
        </div>

        <div style={S.heroSub}>
          Manage your account, track fresh deliveries,
          and view your previous orders easily.
        </div>

        <div style={S.heroBtns}>
          <button style={S.primaryBtn}>
            🛒 Order Fresh Chicken
          </button>

          <button
            style={S.secondaryBtn}
            onClick={handleLogout}
          >
            ⎋ Logout
          </button>
        </div>
      </section>

      {/* BODY */}

      <div style={S.layout}>
        {/* SIDEBAR */}

        <aside style={S.sidebar}>
          <div style={S.sideTitle}>
            Dashboard Menu
          </div>

          {TABS.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                style={S.navItem(active)}
                onClick={() => setActiveTab(tab.id)}
              >
                <div style={S.navIcon(active)}>
                  {tab.icon}
                </div>

                <div style={{ textAlign: "left" }}>
                  <div style={S.navLabel(active)}>
                    {tab.label}
                  </div>

                  <div style={S.navSub}>
                    {tab.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </aside>

        {/* MAIN */}

        <main style={S.main}>
          <div style={S.contentCard}>
            <div style={S.contentHeader}>
              <div style={S.contentIcon}>
                {activeTabData?.icon}
              </div>

              <div>
                <div style={S.contentTitle}>
                  {activeTabData?.label}
                </div>

                <div style={S.contentSub}>
                  {activeTabData?.sub}
                </div>
              </div>
            </div>

            <div style={S.contentBody}>
              {activeTabData?.component}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}