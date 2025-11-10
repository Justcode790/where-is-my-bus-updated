import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignUpPage = () => {
  const [role, setRole] = useState("driver");
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role,
        licenseNumber: role === "driver" ? data.licenseNumber : undefined,
        phone: role === "driver" ? data.phone : undefined,
        experience: role === "driver" ? data.experience : undefined,
        govtIdNumber: role === "official" ? data.govtIdNumber : undefined,
        documentType: role === "official" ? data.documentType : undefined,
        documentUrl: role === "official" ? data.documentUrl : undefined,
      };

      const res = await registerUser(payload);

      alert(`Welcome ${res.user.name}, your account has been created!`);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans bg-cover bg-center"
      style={{ backgroundImage: "url('./people-waiting-bus-bus-stop.png')" }}
    >
      <div className="bg-white/50 p-10 rounded-lg shadow-xl w-full max-w-md backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
          <p className="text-gray-500">National Bus Tracking Platform</p>
        </div>

        {/* Role selection */}
        <div className="mb-5 flex gap-4 justify-center">
          <button
            type="button"
            onClick={() => setRole("driver")}
            className={`px-4 py-2 rounded ${
              role === "driver" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Driver
          </button>
          <button
            type="button"
            onClick={() => setRole("official")}
            className={`px-4 py-2 rounded ${
              role === "official" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Official
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="Tushar Kumar"
              className="shadow border rounded w-full py-3 px-4"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
              placeholder="example@gmail.com"
              className="shadow border rounded w-full py-3 px-4"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
              placeholder="********"
              className="shadow border rounded w-full py-3 px-4"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Confirm password",
                validate: (v) => v === watch("password") || "Passwords do not match",
              })}
              placeholder="********"
              className="shadow border rounded w-full py-3 px-4"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>

          {/* Driver-specific fields */}
          {role === "driver" && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">License Number</label>
                <input
                  type="text"
                  {...register("licenseNumber", { required: "License is required" })}
                  placeholder="DL-1234567890"
                  className="shadow border rounded w-full py-3 px-4"
                />
                {errors.licenseNumber && <p className="text-red-500 text-sm">{errors.licenseNumber.message}</p>}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                <input
                  type="text"
                  {...register("phone", { required: "Phone is required" })}
                  placeholder="9876543210"
                  className="shadow border rounded w-full py-3 px-4"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>
            </>
          )}

          {/* Official-specific fields */}
          {role === "official" && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Govt ID Number</label>
                <input
                  type="text"
                  {...register("govtIdNumber")}
                  placeholder="ABC123456"
                  className="shadow border rounded w-full py-3 px-4"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Document Type</label>
                <input
                  type="text"
                  {...register("documentType")}
                  placeholder="ID Proof"
                  className="shadow border rounded w-full py-3 px-4"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full"
          >
            Sign Up
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg w-full mt-3"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
