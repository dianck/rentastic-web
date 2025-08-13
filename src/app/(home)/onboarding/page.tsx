
import HotelDetailsStep from "@/components/wixard/steps/HotelDetailsStep";
import HotelForm from "@/components/wixard/steps/HotelForm";
import PropertyCategoryStep from "@/components/wixard/steps/PropertyCategoryStep";
import UploadPhotos from "@/components/wixard/steps/PropertyPhotosStep";
import RoomAmenitiesStep from "@/components/wixard/steps/RoomAmenitiesStep";
import RoomDetailsStep from "@/components/wixard/steps/RoomDetailsStep";
import RoomPriceStep from "@/components/wixard/steps/RoomPriceStep";
import Wizard from "@/components/wixard/Wizard";

export default function WizardPage() {
  return (
    <Wizard
      steps={[
        <PropertyCategoryStep key="step1" />,
        <HotelDetailsStep key="step2" />,
        <RoomDetailsStep key="step3" />,
        <RoomAmenitiesStep key="step4" />,
        <RoomPriceStep key="step5" />,
        <UploadPhotos key="step6" />,
        // <HotelForm key="step7" />,
      ]}
    />
  );
}
