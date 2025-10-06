import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "@fontsource/roboto/700.css";
import AuthTrello from "/src/assets/AuthTrello.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { getUser } from "../../services/authApi";
import { showError, showSuccess } from "../../utils/Mess";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = { email: "", password: "" };
    let hasError = false;

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
      hasError = true;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password không được để trống";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return showError([newErrors.email, newErrors.password]);
    }

    dispatch(getUser({ email: formData.email, password: formData.password }))
      .unwrap()
      .then(() => {
        showSuccess("Đăng nhập thành công");
        navigate(`/dashboard`);
      })
      .catch(() => {
        showError(["Email không đúng", "Hoặc mật khẩu không đúng"]);
      });
  };

  return (
    <div className="h-screen w-screen bg-[#ffffff] flex justify-center items-center">
      <div className="h-[441.14px] w-[298px]">
        <div className="flex justify-center items-center mb-[24px]">
          <img src={AuthTrello} alt="Logo" width={150} height={42.55} />
        </div>

        <form className="mb-[48px]" onSubmit={handleSubmit}>
          <h3 className="mb-[16.5px]">Please sign in</h3>

          <div>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className={`mt-2 border-1 ${
                errors.email ? "border-red-500" : "border-[#DEE2E6]"
              } rounded-[6px] rounded-b-none w-[296px] h-[56px] pl-[13px] placeholder-black text-black font-normal focus:outline-none focus:border-blue-500`}
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`border-1 ${
                errors.password ? "border-red-500" : "border-[#DEE2E6]"
              } rounded-[6px] rounded-t-none w-[296px] h-[56px] pl-[13px] placeholder-black text-black font-normal focus:outline-none focus:border-blue-500`}
            />
          </div>

          <div className="mb-[8px] mt-2 flex gap-1">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="cursor-pointer"
            />
            <label className="cursor-pointer select-none">Remember me</label>
          </div>

          <p>
            Don't have an account,{" "}
            <NavLink
              to={"/register"}
              className="ml-1.5 cursor-pointer text-blue-600 hover:underline"
            >
              click here !
            </NavLink>
          </p>

          <Button variant="primary" type="submit" className="w-[298px] mt-2">
            Sign in
          </Button>
        </form>

        <div className="font-normal text-base tracking-normal align-middle text-[rgba(33,37,41,0.75)]">
          © 2025 - Rikkei Education
        </div>
      </div>
    </div>
  );
}
