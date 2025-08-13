// components/Wizard/steps/PropertyCategoryStep.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import WizardStep from "../WizardStep";

interface PropertyCategory {
  id: string;
  name: string;
  description: string;
}

export default function PropertyCategoryStep() {
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <WizardStep>
        <p>Loading categories...</p>
      </WizardStep>
    );
  }

  return (
    <WizardStep>
      <h2 className="text-lg font-bold mb-4">Select Property Category</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="border p-4 rounded hover:border-blue-500 text-left"
          >
            <div className="font-semibold">{cat.name}</div>
            <div className="text-sm text-gray-500">{cat.description}</div>
          </button>
        ))}
      </div>
    </WizardStep>
  );
}
