import SmileIcon from "@/shared/assets/icon/smile.svg";
import ChatIcon from "@/shared/assets/icon/chat.svg";
import ExitIcon from "@/shared/assets/icon/exit.svg";

import SettingsItem from "@/shared/components/molecule/SettingsItem";
import SettingsHeader from "@/shared/components/organism/SettingsHeader";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

function Settings() {
  return (
    <main className="h-full w-full flex flex-col">
      <SettingsHeader />
      <SettingsItem
        href="/app/settings/profile"
        iconSrc={SmileIcon}
        content="Change Profile Info"
      />
      <SettingsItem
        href="/app/settings/notifications"
        iconSrc={ChatIcon}
        content="Notifications"
      />
      <SettingsItem
        onClick={() => signOut(auth)}
        iconSrc={ExitIcon}
        content="Sign Out"
      />
    </main>
  );
}

export default Settings;
