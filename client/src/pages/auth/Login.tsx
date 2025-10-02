import React from "react";
import Button from "react-bootstrap/Button";
import "@fontsource/roboto/700.css";
import AuthTrello from "/src/assets/AuthTrello.png";
export default function Login() {
  return (
    <div className="h-screen w-screen bg-[#ffffff] flex justify-center items-center">
      <div className="h-[441.14px] w-[298px] ">
        <div className="flex justify-center items-center mb-[24px]">
          <img src={AuthTrello} alt="Logo" width={150} height={42.55} />
        </div>
        <div className="mb-[48px]">
          <h3 className="mb-[16.5px]">Please sign in</h3>
          <input
            type="text"
            placeholder="Email address"
            className="mt-2 border-1 border-[#DEE2E6] rounded-[6px] rounded-b-none w-[296px] h-[56px] pl-[13px] placeholder-black text-black font-normal"
          />
          <input
            type="text"
            placeholder="Password"
            className=" border-1 border-[#DEE2E6] rounded-[6px] rounded-t-none w-[296px] h-[56px] pl-[13px]  placeholder-black text-black font-normal"
          />

          <div className="mb-[8px] mt-2 flex gap-1 ">
            <input type="checkbox" className=" " />
            <label> Remember me</label>
          </div>
          <p>
            Don't have an account,{" "}
            <a href="" className="ml-1.5">
              click here !
            </a>
          </p>
          <Button variant="primary" className="w-[298px]">
            Sign in
          </Button>
        </div>
        <div className=" font-normal text-base  tracking-normal align-middle text-[rgba(33,37,41,0.75)]">
          © 2025 - Rikkei Education
        </div>
      </div>
    </div>
  );
}
