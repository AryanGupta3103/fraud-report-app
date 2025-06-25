import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import WalletInput from "./components/WalletInput";
import Timeline from "./components/Timeline";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState("");
  const [risk, setRisk] = useState("low");
  const [reports, setReports] = useState([]);

  // 🔐 Sign Up
  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Sign up successful!");
  };

  // 🔐 Log In and set user
  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      setUser(data.user);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      localStorage.setItem("access_token", session.access_token);
      alert("Login successful!");
    }
  };

  // 📄 Fetch reports from backend
  const fetchReports = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    if (!token || !user?.email) return;

    const res = await fetch(`http://localhost:5050/api/reports?user_email=${user.email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (data?.results) {
      setReports(data.results);
    }
  };

  // ⏳ Fetch after login
  useEffect(() => {
    if (user) fetchReports();
  }, [user]);

  // 📝 Submit report
  const submitReport = async () => {
    if (!wallet) return alert("Please enter a valid wallet.");

    const today = new Date().toISOString().split("T")[0];
    const count = JSON.parse(localStorage.getItem("reportCount") || "{}");

    if (!count[today]) count[today] = 0;
    if (count[today] >= 3) {
      alert("Daily report limit (3) reached.");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    const response = await fetch("http://localhost:5050/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_email: user.email,
        wallet,
        risk,
        date: today,
      }),
    });

    if (response.ok) {
      alert("Report submitted!");
      count[today]++;
      localStorage.setItem("reportCount", JSON.stringify(count));
      fetchReports();
    } else {
      const err = await response.json();
      alert("Failed to submit report: " + (err?.error || "Unknown error"));
      console.error("❌ Error submitting report:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto bg-white p-4 sm:p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Incident Reporter</h1>

        {!user ? (
          <>
            <input
              type="email"
              placeholder="Email"
              className="border p-2 w-full mb-2"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 w-full mb-4"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={signUp} className="bg-blue-600 text-white px-4 py-2 rounded">
                Sign Up
              </button>
              <button onClick={signIn} className="bg-green-600 text-white px-4 py-2 rounded">
                Log In
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-2">
              Logged in as <b>{user.email}</b>
            </p>

            <a href="/admin" className="text-blue-500 underline text-sm mb-4 inline-block">
              Go to Admin Dashboard
            </a>

            <WalletInput onValid={setWallet} />

            <label className="block mt-4 mb-1 font-semibold">Select Risk Level:</label>
            <select
              className="border p-2 w-full mb-4"
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>

            <button
              onClick={submitReport}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded"
            >
              Submit Report
            </button>

            <Timeline reports={reports} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
