import React, { useState } from "react";
import axios from "axios";

function Auth({ setIsAuthenticated }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        // REGISTER USER
        await axios.post("http://localhost:5000/register", {
          email,
          password,
        });

        alert("Registration successful! Please login.");
        setIsRegistering(false);
        setEmail("");
        setPassword("");
      } else {
        // LOGIN USER
        const res = await axios.post("http://localhost:5000/login", {
          email,
          password,
        });

        localStorage.setItem("token", res.data.token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>SRS Ambiguity Detection System</h1>

        <h2 style={styles.subtitle}>
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          {isRegistering ? "Already have an account?" : "New user?"}{" "}
          <span
            onClick={() => setIsRegistering(!isRegistering)}
            style={styles.link}
          >
            {isRegistering ? "Login here" : "Register here"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "40px",
    borderRadius: "10px",
    width: "350px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  },
  title: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  subtitle: {
    marginBottom: "25px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "none",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  link: {
    color: "#60a5fa",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Auth;