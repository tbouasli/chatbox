import BackIcon from "@/shared/assets/icon/back.svg";

import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)}>
      <img src={BackIcon} alt="Back" height={16} width={16} />
    </button>
  );
}

export default BackButton;
