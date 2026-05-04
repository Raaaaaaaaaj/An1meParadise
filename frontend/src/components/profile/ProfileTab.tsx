import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


const ProfileTab = () => {
  const [formData, setFormData] = useState({
    userName: "",
    userMail: "",
    userMobile: "",
    userCity: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Safe user fetch
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  // ===============================
  // ✅ FETCH PROFILE
  // ===============================
  const fetchProfile = async () => {
    if (!userId) {
      console.log("❌ No userId found");
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/api/user/profile/${userId}`
      );

      console.log("✅ FETCHED USER DATA:", res.data); // 🔥 DEBUG

      setFormData({
        userName: res.data.userName || "",
        userMail: res.data.userMail || "",
        userMobile: res.data.userMobile || "",
        userCity: res.data.userCity || "",
      });
    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  // ===============================
  // ✅ HANDLE INPUT
  // ===============================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    console.log("✏️ INPUT CHANGE:", name, value); // 🔥 DEBUG

    // 🔥 IMPORTANT (fix freeze issue)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // ✅ UPDATE PROFILE
  // ===============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("User not found ❌");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        user_id: userId,
        userName: formData.userName,
        userMobile: formData.userMobile,
        userCity: formData.userCity,
      };

      console.log("🚀 UPDATE PAYLOAD:", payload); // 🔥 DEBUG

      const res = await axios.put(
        `${API_URL}/api/user/profile`,
        payload
      );

      console.log("✅ UPDATE RESPONSE:", res.data); // 🔥 DEBUG

      alert("Profile updated ✅");
    } catch (err: any) {
      console.error("❌ UPDATE ERROR:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-glow-purple">
        Profile Details
      </h2>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="text-sm text-muted-foreground">Full Name</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-primary"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <input
            type="email"
            value={formData.userMail}
            readOnly
            placeholder="Enter your email"
            className="w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-primary"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Phone</label>
          <input
            type="text"
            name="userMobile"
            value={formData.userMobile}
            onChange={handleChange}
            placeholder="Enter your phone"
            className="w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-primary"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">City</label>
          <input
            type="text"
            name="userCity"
            value={formData.userCity}
            onChange={handleChange}
            placeholder="Enter your city"
            className="w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-primary"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-6 py-2 rounded-lg bg-gradient-neon text-black font-semibold"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;