import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail"); // ✅ ADD THIS LINE
  navigate("/login");
};

  return (
    <nav style={styles.navbar}>
      <h3 style={styles.logo}>My App</h3>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>

        {!token && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Signup</Link>
          </>
        )}

        {token && (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <button onClick={logout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    backgroundColor: "#1f2937",
    color: "white",
  },
  logo: {
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  },
  logoutBtn: {
    background: "#ef4444",
    border: "none",
    padding: "6px 12px",
    color: "white",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default Navbar;