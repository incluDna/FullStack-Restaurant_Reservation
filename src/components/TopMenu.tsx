"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { getAuthCookie } from "@/libs/getAuthCookie";
import { useEffect, useState } from "react";
import getUserProfile from "@/libs/getUserProfile";

export default function TopMenu() {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const data = await getAuthCookie();
        if (data.success) {
          setToken(data.token);
          setRole(data.role || null);
          const userProfile = await getUserProfile(data.token);
          setProfile(userProfile);
        } else {
          console.error("Auth error:", data.error);
        }
      } catch (err) {
        console.error("Failed to fetch auth cookie", err);
      }
    }
    fetchToken();
  }, []);

  // Debug Token
  useEffect(() => {
    if (token) {
      console.log("Updated token:", token);
    }
  }, [token]);

  // Debug Profile
  useEffect(() => {
    if (profile) {
      console.log("Updated profile:", profile);
    }
  }, [profile]);

  return (
    <div className="w-full h-[60px] bg-[#FFECAD] absolute z-30 flex">
      {/* Logo */}
      <motion.div
        className="h-full w-[60px] flex-shrink-0 flex items-center justify-center bg-[#F89640]"
        whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
      >
        <Link href={"/"}>
          <img className="h-[52px]" alt="Logo" src="/images/logo.jpg" />
        </Link>
      </motion.div>

      {/* Queue Stuff */}

      {/* If logged in then show profile */}

      {profile ? (
        // Profile
        <Link href={"/profile"}>
          <motion.div
            className="h-full w-fit text-white bg-[#F89640] items-center flex px-16 absolute right-0"
            whileHover={{ backgroundColor: "#5A2934", fontSize: "17px" }}
            transition={{ duration: 0.3 }}
          >
            Profile
          </motion.div>
        </Link>
      ) : (
        // Login
        <Link href={"/login"}>
          <motion.div
            className="h-full w-fit text-white bg-[#F89640] items-center flex px-16 absolute right-0"
            whileHover={{ backgroundColor: "#5A2934", fontSize: "17px" }}
            transition={{ duration: 0.3 }}
          >
            Login
          </motion.div>
        </Link>
      )}
    </div>
  );
}
