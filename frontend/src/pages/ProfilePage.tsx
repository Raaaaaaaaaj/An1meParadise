import { useState } from "react";
import Sidebar from "../components/profile/Sidebar";
import ProfileTab from "@/components/profile/ProfileTab";
import AddressTab from "@/components/profile/AddressTab";
import OrdersTab from "@/components/profile/OrdersTab";
import PrivacyTab from "@/components/profile/PrivacyTab";

type TabType = "profile" | "address" | "orders" | "privacy";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "address":
        return <AddressTab />;
      case "orders":
        return <OrdersTab />;
      case "privacy":
        return <PrivacyTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background text-foreground pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Right Content */}
        <div className="md:col-span-3 bg-gradient-card p-6 rounded-2xl border border-border shadow-lg">
          {renderTab()}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;