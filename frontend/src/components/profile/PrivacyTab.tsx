import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;


const PrivacyTab = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);


  // 🔥 get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setMessage("User not found ❌");
      return;
    }

    if (!form.currentPassword || !form.newPassword) {
      setMessage("All fields required ❌");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await axios.put(
        `${API_URL}/api/user/change-password`,
        {
          user_id: userId,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }
      );

      setMessage(res.data.message);

      // reset form
      setForm({
        currentPassword: "",
        newPassword: "",
      });

    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-primary">
        Privacy Settings
      </h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-4"
      >
        {/* Current Password */}
        <div>
          <label className="text-sm text-muted-foreground">
            Current Password
          </label>
          <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            className="w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-primary"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="text-sm text-muted-foreground">
            New Password
          </label>
          <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            className="w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-primary"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <p className="text-sm text-center text-muted-foreground">
            {message}
          </p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 px-6 py-2 rounded-lg bg-gradient-neon text-black font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default PrivacyTab;