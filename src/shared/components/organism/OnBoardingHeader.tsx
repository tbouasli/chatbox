import Title from "@/shared/components/atom/Title";
import AppHeaderWithBackButton from "../molecule/AppHeaderWithBackButton";

function OnBoardingHeader() {
  return (
    <AppHeaderWithBackButton>
      <Title text="Create Profile" />
    </AppHeaderWithBackButton>
  );
}

export default OnBoardingHeader;
