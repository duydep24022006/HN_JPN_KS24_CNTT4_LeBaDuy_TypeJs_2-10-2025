import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "@fontsource/roboto/700.css";
import AuthTrello from "/src/assets/AuthTrello.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { showError, showSuccess } from "../../utils/Mess";
import { postUser } from "../../services/authApi";
import type { User } from "../../utils/types";

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    email: "",
    user: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const errorArr: string[] = [];

    if (!formData.email.trim()) {
      errorArr.push("Email không được để trống");
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    ) {
      errorArr.push("Email không hợp lệ");
    }

    if (!formData.user.trim()) {
      errorArr.push("Username không được để trống");
    } else if (formData.user.length < 3) {
      errorArr.push("Username phải từ 3 ký tự trở lên");
    }

    if (!formData.password.trim()) {
      errorArr.push("Password không được để trống");
    } else if (formData.password.length < 8) {
      errorArr.push("Password phải từ 8 ký tự trở lên");
    }

    if (errorArr.length > 0) {
      showError(errorArr);
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newUser: User = {
      id: Number(
        `${Date.now().toString().slice(-4)}${Math.floor(
          1000 + Math.random() * 9000
        )}`
      ),
      email: formData.email,
      username: formData.user,
      password: formData.password,
      created_at: new Date().toISOString(),
    };

    dispatch(postUser(newUser))
      .unwrap()
      .then(() => {
        showSuccess("Đăng ký thành công!");
        navigate("/login");
      })
      .catch((err) => {
        showError([typeof err === "string" ? err : "Đăng ký thất bại!"]);
      });
  };

  return (
    <div className="h-screen w-screen bg-[#ffffff] flex justify-center items-center">
      <div className="h-[441.14px] w-[298px] ">
        <div className="flex justify-center items-center mb-[24px]">
          <img src={AuthTrello} alt="Logo" width={150} height={42.55} />
        </div>
        <form className="mb-[48px]" onSubmit={handleSubmit}>
          <h3 className="mb-[16.5px]">Please sign up</h3>
          <input
            type="text"
            name="email"
            value={formData.email}
            placeholder="Email address"
            onChange={handleChange}
            className="mt-2 border-1 border-[#DEE2E6] rounded-[6px] rounded-b-none w-[296px] h-[56px] pl-[13px] placeholder-black text-black font-normal"
          />
          <input
            type="text"
            name="user"
            value={formData.user}
            placeholder="Username"
            onChange={handleChange}
            className="border-1 border-[#DEE2E6] w-[296px] h-[56px] pl-[13px] placeholder-black text-black font-normal"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            className="mb-2 border-1 border-[#DEE2E6] rounded-[6px] rounded-t-none w-[296px] h-[56px] pl-[13px] placeholder-black text-black font-normal"
          />
          <p>
            Already have an account,
            <NavLink to={"/login"} className="ml-1.5  cursor-pointer">
              click here !
            </NavLink>
          </p>
          <Button variant="primary" className="w-[298px] mt-2" type="submit">
            Sign up
          </Button>
        </form>
        <div className=" font-normal text-base  tracking-normal align-middle text-[rgba(33,37,41,0.75)]">
          © 2025 - Rikkei Education
        </div>
      </div>
    </div>
  );
}
