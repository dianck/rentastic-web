// components/Wizard/steps/PropertyCategoryStep.tsx
import WizardStep from "../WizardStep";

const categories = [
  { name: "Hotel", desc: "Accommodations for travelers often with restaurants, meeting rooms and other guest services" },
  { name: "Guesthouse", desc: "Private home with separate living facilities for host and guest" },
  { name: "Bed and breakfast", desc: "Private home offering overnight stays and breakfast" },
  { name: "Homestay", desc: "Private home with shared living facilities for host and guest" },
  { name: "Hostel", desc: "Budget accommodations with mostly dorm-style beds and social atmosphere" },
  { name: "Condo hotel", desc: "Independent apartments with some hotel facilities like a front desk" },
  { name: "Capsule Hotel", desc: "Extremely small units or capsules offering cheap and basic overnight accommodations" },
  { name: "Country House", desc: "Private home in the countryside with simple accommodations" },
  { name: "Farm stay", desc: "Private farm with simple accommodations" },

];

export default function PropertyCategoryStep() {
  return (
    <WizardStep>
      <h2 className="text-lg font-bold mb-4">Select Property Category</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className="border p-4 rounded hover:border-blue-500 text-left"
          >
            <div className="font-semibold">{cat.name}</div>
            <div className="text-sm text-gray-500">{cat.desc}</div>
          </button>
        ))}
      </div>
    </WizardStep>
  );
}
