import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


interface Address {
  id: number;
  user_id: number;
  name: string;
  phNum: string;
  house_no: string;
  strt_add: string;
  landmark: string;
  state: string;
  pincode: string;
  type: string;
  status: "Active" | "Inactive";
  // status: number;
}

const AddressTab = () => {
//   const user_id = 1; // 🔥 replace with auth user later
const [userId, setUserId] = useState<number | null>(null);
 // ✅ user fetch (localStorage se)
useEffect(() => {
  const userData = localStorage.getItem("user");

  if (userData) {
    const user = JSON.parse(userData);
    setUserId(user?.id);
  }
}, []);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phNum: "",
    house_no: "",
    strt_add: "",
    landmark: "",
    state: "",
    pincode: "",
    type: "Home",
  });

  // ✅ fetch function
  const fetchAddresses = async () => {
    if (!userId) return;   // 🔥 guard
  
    try {
      const res = await axios.get(
        `${API_URL}/api/address/${userId}`
      );
  
      setAddresses(res.data);
  
      const active = res.data.find((a: Address) => a.status === "Active");
      // const active = res.data.find((a: Address) => a.status === 1);
      if (active) setSelectedId(active.id);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ 🔥 YEH WALA PART (yahan add karna hai)
  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  // ✅ Handle Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add Address
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("user: ", userId);
  
    if (!userId) {
      console.error("User not found");
      return;
    }
  
    try {
      await axios.post(`${API_URL}/api/address`, {
        user_id: userId,   // ✅ FIXED
        ...formData,
      });
  
      await fetchAddresses();
  
      setFormData({
        name: "",
        phNum: "",
        house_no: "",
        strt_add: "",
        landmark: "",
        state: "",
        pincode: "",
        type: "Home",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Set Default Address
  // const handleSelect = async (id: number) => {
  //   setSelectedId(id);

  //   await axios.put(`${API_URL}/api/address/default`, {
  //     user_id: userId,
  //     address_id: id,
  //   });

  //   fetchAddresses();
  // };


  const handleSelect = async (id: number) => {
    try {
      await axios.put(`${API_URL}/api/address/default`, {
        user_id: userId,
        address_id: id,
      });
  
      // ✅ directly update UI
      setSelectedId(id);
  
      // ✅ update local state also
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          status: addr.id === id ? "Active" : "Inactive",
          // status: addr.id === id ? 1 : 0,        
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-primary">
        Your Addresses
      </h2>

      {/* 🔥 Address List (Accordion style) */}
      <div className="space-y-3 mb-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="border border-border rounded-lg p-4 bg-muted"
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                checked={selectedId === addr.id}
                onChange={() => handleSelect(addr.id)}
              />

              <div>
                <p className="font-medium text-primary">
                  {addr.name} ({addr.phNum})
                </p>
                <p className="text-sm text-muted-foreground">
                  {addr.house_no}, {addr.strt_add}, {addr.landmark}
                </p>
                <p className="text-sm text-muted-foreground">
                  {addr.state} - {addr.pincode}
                </p>
                <span className="text-xs bg-gradient-neon px-2 py-1 rounded text-black">
                  {addr.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 Add New Address */}
      <h3 className="text-xl mb-3 text-primary font-semibold">Add New Address</h3>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="input w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-primary"
        />

        <input
          name="phNum"
          value={formData.phNum}
          onChange={handleChange}
          placeholder="Phone Number"
          className="input w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-primary"
        />

        <input
          name="house_no"
          value={formData.house_no}
          onChange={handleChange}
          placeholder="House No"
          className="input w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-primary"
        />

        <input
          name="strt_add"
          value={formData.strt_add}
          onChange={handleChange}
          placeholder="Street Address"
          className="input w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-primary"
        />

        <input
          name="landmark"
          value={formData.landmark}
          onChange={handleChange}
          placeholder="Landmark"
          className="input w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-primary"
        />

        <input
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State"
          className="input w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-primary"
        />

        <input
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          className="input w-full mt-1 p-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-primary"
        />

        <div className="md:col-span-2">
          <button className="px-6 py-2 bg-gradient-neon text-black rounded-lg">
            Add Address
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressTab;