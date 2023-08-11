import React from "react";

import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { Button } from "@/shared/components/ui/button";
import GoogleLogo from "@/shared/assets/logo/google.svg";

const provider = new GoogleAuthProvider();

function ContinueWithGoogle() {
  function handleClick() {
    signInWithPopup(auth, provider);
  }

  return (
    <Button variant="outline" className="w-full" onClick={handleClick}>
      <img src={GoogleLogo} alt="Google Logo" height={24} width={24} />
      Continue with Google
    </Button>
  );
}

export default ContinueWithGoogle;
