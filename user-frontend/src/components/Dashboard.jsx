import { useEffect, useState } from "react";

function Dashboard() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg">Profile</h2>
          <p className="text-gray-600">Logged in as: {email}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg">Stats</h2>
          <p className="text-gray-600">Activity overview</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg">Settings</h2>
          <p className="text-gray-600">Manage account</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;