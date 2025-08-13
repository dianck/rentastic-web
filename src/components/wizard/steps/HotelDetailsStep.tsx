// components/Wizard/steps/HotelDetailsStep.tsx
import WizardStep from "../WizardStep";

export default function HotelDetailsStep() {
  return (
    <WizardStep>
      <h2 className="text-lg font-bold mb-4">Tell us about your hotel</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Property Name"
          className="w-full border p-2 rounded"
        />
        <div>
          <label className="block font-semibold mb-2">Star Rating</label>
          <select className="w-full border p-2 rounded">
            <option>N/A</option>
            <option>1 Star</option>
            <option>2 Stars</option>
            <option>3 Stars</option>
            <option>4 Stars</option>
            <option>5 Stars</option>
          </select>
        </div>
        {/* <div>
          <label className="block font-semibold mb-2">
            Are you part of a group or chain?
          </label>
          <select className="w-full border p-2 rounded">
            <option>No</option>
            <option>Yes</option>
          </select>
        </div> */}
      </div>
    </WizardStep>
  );
}
