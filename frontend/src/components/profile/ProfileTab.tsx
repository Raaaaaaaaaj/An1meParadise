import React from "react";

const ProfileTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-glow-purple">
        Profile Details
      </h2>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label className="text-sm text-muted-foreground">Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Phone</label>
          <input
            type="text"
            placeholder="Enter your phone"
            className="w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">City</label>
          <input
            type="text"
            placeholder="Enter your city"
            className="w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="mt-4 px-6 py-2 rounded-lg bg-gradient-neon text-black font-semibold hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;