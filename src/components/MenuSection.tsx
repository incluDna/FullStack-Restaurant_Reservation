import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import MenuCard from "@/components/MenuCard";
import { Menu } from "../../interfaces";
import { useState, useEffect } from "react";

const tabOptions = ["dish", "drink", "set"];

interface MenuSectionProps {
  id: string;
  token: string | null;
  profile: any;
  menuData: Menu[] | null;
}

export default function MenuSection({
  id,
  token,
  profile,
  menuData,
}: MenuSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("dish");
  const [filteredMenu, setFilteredMenu] = useState<Menu[] | null>(null);

  useEffect(() => {
    const filtered = menuData?.filter((item) => item.type === activeTab) || [];
    setFilteredMenu(filtered);
  }, [menuData, activeTab]);

  return (
    <section className="flex flex-col gap-3 px-4 lg:px-20 pb-12">
      <div className="flex flex-row justify-center items-center gap-x-4 mb-8">
        <h1 className="text-3xl font-bold text-center">Menu</h1>
        {(profile?.data?.role === "admin" || profile?.data?.role === "employee") && (
          <motion.button
            whileHover={{ backgroundColor: "black", scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={() => router.push(`/restaurants/${id}/create`)}
            className="w-[45px] h-[45px] bg-[#3d3c3a] text-white text-xl border-0 rounded-none"
          >
            +
          </motion.button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8 gap-4">
        {tabOptions.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              if (activeTab !== tab) setFilteredMenu(null);
              setActiveTab(tab);
            }}
            className={`px-6 py-2 border-b-4 text-lg ${
              activeTab === tab
                ? "border-[#F89640] text-[#F89640]"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards */}
      {activeTab === "dish" && (
        <div className="h-[320px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredMenu?.map((item, i) => (
            <MenuCard key={i} menu={item} role={profile?.data?.role} token={token} />
          ))}
        </div>
      )}
      {activeTab === "set" && (
        <div className="h-[320px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredMenu?.map((item, i) => (
            <MenuCard key={i} menu={item} role={profile?.data?.role} token={token} />
          ))}
        </div>
      )}
      {activeTab === "drink" && (
        <div className="h-[320px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredMenu?.map((item, i) => (
            <MenuCard key={i} menu={item} role={profile?.data?.role} token={token} />
          ))}
        </div>
      )}
    </section>
  );
}
