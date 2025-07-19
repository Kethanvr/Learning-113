"use client ";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

const login = () => {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: '/',
        }).catch((error) => {
            console.error("Login failed:", error);
            alert("Login failed. Please check your credentials and try again.");
        });
    };


  return (
    <div>
      <h1>Login Page</h1>
      <form>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default login;
