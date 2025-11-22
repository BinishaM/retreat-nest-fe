import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/api/auth"; // you will create this API file
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.email.trim()) newErrors.email = "Email is required.";
        if (!formData.password.trim()) newErrors.password = "Password is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        // Convert to FormData

        try {
            const res = await loginUser(formData);
            console.log(res)
            // Store in sessionStorage
            sessionStorage.setItem("access_token", res.data.access_token);
            sessionStorage.setItem("refresh_token", res.data.refresh_token);

            toast.success("Login successful!");

            navigate("/dashboard");

        } catch (error: any) {
            console.error("Login error:", error);
            toast.error(error?.response?.data?.message || "Invalid login credentials.");
        }

        setLoading(false);
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md bg-gray-800 px-14 py-10 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6 mt-4 text-center">Login to continue</h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 rounded-md bg-gray-300 text-black placeholder:text-gray-600 border ${errors.email ? "border-red-500" : "border-gray-600"
                                }`}
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 pr-10 rounded-md bg-gray-700 text-white placeholder:text-gray-400 caret-white border ${errors.password ? "border-red-500" : "border-gray-600"
                                }`}
                            placeholder="Enter your password"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                        >
                            {showPassword ? (
                                <EyeOff
                                    className={`w-5 h-5 ${errors.password ? "text-red-500" : "text-gray-500 hover:text-gray-400"
                                        }`}
                                />
                            ) : (
                                <Eye
                                    className={`w-5 h-5 ${errors.password ? "text-red-500" : "text-gray-500 hover:text-gray-400"
                                        }`}
                                />
                            )}

                        </button>

                        {errors.password && (
                            <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>



                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
