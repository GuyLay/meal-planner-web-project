import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Form from "../../components/Form";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState(""); // For email error messages
  const [passwordError, setPasswordError] = useState(""); // For password error messages

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (name === "email") setEmailError("");
    if (name === "password") setPasswordError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.error) {
        if (data.error === "User not found") {
            setEmailError("User not found");
            setPasswordError("");
        } else if (data.error === "Incorrect password") {
            setPasswordError("Incorrect password");
            setEmailError("");
        } else {
            console.error(data.error);
        }
    } else {
        setEmailError("");
        setPasswordError("");

        // Save user data to LocalStorage
        localStorage.setItem("user", JSON.stringify(data.data));

        // Emit a custom event to notify Header of the login
        window.dispatchEvent(new Event("userLoggedIn"));
        
        // Navigate to the home page
        router.push("/");
    }
};
  return (
    <>
      <main className="flex-grow container mx-auto py-8">
        <section className="form-section py-8 flex justify-center">
          <Form title="Login to Your Account" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email} // Bind value to formData
                onChange={handleInputChange} // Update formData on input change
                className={`mt-1 block w-full px-3 py-2 border ${
                  emailError ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password} // Bind value to formData
                onChange={handleInputChange} // Update formData on input change
                className={`mt-1 block w-full px-3 py-2 border ${
                  passwordError ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>
            <div className="flex justify-center">
              <button type="submit" className="btn">
                Login
              </button>
            </div>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link href="/auth/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Register
              </Link>
            </p>
          </Form>
        </section>
      </main>
    </>
  );
}