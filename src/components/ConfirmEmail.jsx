import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function ConfirmEmail() {
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    // Verify the user's email
    const verifyEmail = async () => {
      const { error } = await supabase.auth.verifyEmail(
        // Pass in the verification token from the URL
        new URLSearchParams(window.location.search).get("verification_token")
      );
      if (error) {
        setMessage("There was an error verifying your email.");
      } else {
        setMessage("Your email has been verified.");
      }
    };
    verifyEmail();
  }, []);

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
}

export default ConfirmEmail;
