import AppDataContext from "@/app/provider/AppData";
import React from "react";

function useAppData() {
  const { user, chats } = React.useContext(AppDataContext);

  return { user, chats };
}

export default useAppData;
