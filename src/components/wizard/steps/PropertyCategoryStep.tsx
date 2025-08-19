// components/Wizard/steps/PropertyCategoryStep.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import WizardStep from "../WizardStep";
import { useSession } from "next-auth/react";

interface PropertyCategory {
  id: string;
  name: string;
  description: string;
}

export default function PropertyCategoryStep() {
  const { data: session } = useSession();
  const email = session?.user?.email || "";

  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/property/categories", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const fetchProfile = async () => {
    if (!email) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "/property/detail-category",
        { email },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        }
      );

      const data = res.data?.data;

      if (Array.isArray(data) && data.length > 0) {
        const categoryId = data[0]?.id;
        if (categoryId) {
          setSelectedCategoryId(categoryId);
        } else {
          setError("Property category not found.");
        }
      } else {
        setError("Property data not found.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load property details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (categoryId: string) => {
    if (!email) return;

    setError("");
    setSuccess("");

    // console.log("Selected Category: ", categoryId);
    try {
      const res = await axios.post(
        "/property/detail-category-update",
        { email, categoryId },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        }
      );

      setSelectedCategoryId(categoryId);
      setSuccess("Property category updated successfully!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update property category.");
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchCategories();
      await fetchProfile();
    };
    init();
  }, []);

  if (loading) {
    return (
      <WizardStep>
        <p>Loading...</p>
      </WizardStep>
    );
  }

  return (
    <WizardStep>
      <h2 className="text-lg font-bold mb-4">Select Property Category</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const isSelected = cat.id === selectedCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`border p-4 rounded text-left transition-colors ${
                isSelected
                  ? "bg-foreground text-white border-foreground"
                  : "bg-white text-foreground hover:border-blue-500"
              }`}
            >
              <div className="font-semibold">{cat.name}</div>
              <div className="text-sm opacity-80">{cat.description}</div>
            </button>
          );
        })}
      </div>
    </WizardStep>
  );
}
