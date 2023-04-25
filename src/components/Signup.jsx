import { useState } from "react";
import { supabase } from "./client";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { user, error } = await supabase.auth.signUp(
      {
        email: email,
        password: password,
      },
      {
        sendEmailVerification: true, // Include this option to send a verification email
      }
    );
    if (error) {
      console.log(error);
    } else {
      console.log(user);
      window.location.href = "/confirm-email";
      // Redirect the user to the home page or another relevant page
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
