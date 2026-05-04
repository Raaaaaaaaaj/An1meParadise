type TabType = "profile" | "address" | "orders" | "privacy";

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "address", label: "Address" },
  { id: "orders", label: "Orders" },
  { id: "privacy", label: "Privacy" },
];

const Sidebar = ({ activeTab, setActiveTab }: Props) => {
  return (
    <div className="bg-gradient-card p-4 rounded-2xl border border-border">
      <h2 className="text-xl font-semibold mb-4 text-primary">
        My Account
      </h2>

      <div className="flex flex-col gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-left px-4 py-2 rounded-lg transition-all duration-200
              ${
                activeTab === tab.id
                  ? "bg-gradient-neon text-black font-medium"
                  : "hover:bg-muted text-muted-foreground"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;