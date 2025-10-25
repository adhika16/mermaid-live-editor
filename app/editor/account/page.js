"use client";

import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const AccountPage = () => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    setUserData(user);
    
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Account</h1>
      </div>
      <p>Username: {userData?.name}</p>
      <p>Email: {userData?.email}</p>
    </div>
  );
}

export default AccountPage;