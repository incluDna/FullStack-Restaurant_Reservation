'use client'
import { Button, Input } from "@mui/material";
import React, { useState } from "react";
import { Inria_Serif } from "next/font/google";
import userRegister from "@/libs/userRegister";
import { User } from "../../../interface";

const formFields = [
  { id: "name", label: "Name" },
  { id: "telephone", label: "Telephone Number" },
  { id: "email", label: "Email" },
  { id: "password", label: "Password", type: "password" },
];

const inriaSerif = Inria_Serif({
  weight: ["300", "700"],
  subsets: ["latin"],
});

export default function Register() {
  const [name, setName] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const register = async () => {
    if (name && tel && email && password) {
      try {
        setLoading(true); 
        setError(null); 

        const item: User = {
          name: name,
          telephone: tel,
          email: email,
          password: password,
        };

        const result = await userRegister(name, email, tel, password); 

        setLoading(false); 
        setSuccess("Registration successful!"); 

      } catch (error) {
        setLoading(false);
        setError("Registration failed. Please try again.");
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  return (
    <div
      className={`flex items-start justify-center min-h-screen w-full bg-[#FFECAD] pt-[40px] pb-[50px]`}
    >
      <div className="w-full max-w-[900px] min-h-[950px] bg-[#ffffff] rounded-[50px] p-[40px] mx-4">
        <div className="text-center text-[30px] font-bold mb-[15px]">- Register -</div>
        <div className="space-y-10">
          {formFields.map((field) => (
            <div key={field.id} className="space-y-2 pt-[5px] flex flex-col items-center">
              <div className="w-full max-w-[650px] mt-[1px]" style={{ fontWeight: "550" }}>
                <label htmlFor={field.id} className="block text-[25px] text-[#242424]">
                  {field.label}
                </label>
              </div>
              <div className="w-full flex justify-center mt-[10px]">
                <Input
                  id={field.id}
                  type={field.type || "text"}
                  value={
                    field.id === "name"
                      ? name
                      : field.id === "telephone"
                      ? tel
                      : field.id === "email"
                      ? email
                      : password
                  }
                  onChange={(e) =>
                    field.id === "name"
                      ? setName(e.target.value)
                      : field.id === "telephone"
                      ? setTel(e.target.value)
                      : field.id === "email"
                      ? setEmail(e.target.value)
                      : setPassword(e.target.value)
                  }
                  disableUnderline
                  className="h-[74px] bg-[#E5DEC6] rounded-[30px] !text-[22px] w-full max-w-[700px] text-center pl-[30px] pr-[30px]"
                />
              </div>
            </div>
          ))}

          {error && <div className="text-[#F60404] text-[25px] text-center pt-[1px]">{error}</div>}
          {success && <div className="text-[#04F630] text-[25px] text-center pt-[1px]">{success}</div>}

          <div className="flex justify-center !mt-[50px]">
            <Button
              onClick={register} 
              variant="contained"
              disableElevation
              className={`!bg-[#F89640] hover:!bg-[#A4530C] text-[#e0e5de] !text-[25px] w-[360px] sm:w-[243px] h-[74px] !rounded-[30px] normal-case`}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
