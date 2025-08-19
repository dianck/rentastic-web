
import HotelDetailsStep from "@/components/wizard/steps/HotelDetailsStep";
import PropertyCategoryStep from "@/components/wizard/steps/PropertyCategoryStep";
import UploadPhotos from "@/components/wizard/steps/PropertyPhotosStep";
import RoomAmenitiesStep from "@/components/wizard/steps/RoomAmenitiesStep";
import RoomDetailsStep from "@/components/wizard/steps/RoomDetailsStep";
import RoomPriceStep from "@/components/wizard/steps/RoomPriceStep";
import Wizard from "@/components/wizard/Wizard";

export default function RoomsWizardPage() {
  return (
    <Wizard
      steps={[
        <PropertyCategoryStep key="step1" />,
        // <HotelDetailsStep key="step2" />,
        <RoomDetailsStep key="step2" />,
        // <RoomAmenitiesStep key="step3" />,
        // <RoomPriceStep key="step4" />,
        // <UploadPhotos key="step5" />,
        // <HotelForm key="step7" />,
      ]}
    />
  );
}
