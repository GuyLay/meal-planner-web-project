import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import NavBar from "./NavBar";

const Header = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPic, setUserPic] = useState("/images/defaultprofile.jpg");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateUserState = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.firstName || "User");
        setUserPic(user.profileImage || "/images/defaultprofile.jpg");
      } else {
        setIsLoggedIn(false);
        setUserName("");
        setUserPic("/images/defaultprofile.jpg");
      }
    };
    updateUserState();
    window.addEventListener("userLoggedIn", updateUserState);
    window.addEventListener("userLoggedOut", updateUserState);
    return () => {
      window.removeEventListener("userLoggedIn", updateUserState);
      window.removeEventListener("userLoggedOut", updateUserState);
    };
  }, []);

  useEffect(() => {
    // Check initial theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    setUserPic("/images/defaultprofile.jpg");
    window.dispatchEvent(new Event("userLoggedOut"));
    router.push("/");
  };

  return (
    <header className="py-4 shadow-md transition-colors duration-200">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <div className="flex-1 flex justify-center md:justify-start mb-4 md:mb-0">
          <Link href="/" legacyBehavior>
            <a>
              <img
                src="../images/logo.png"
                alt="Plan & Plate Logo"
                className="h-12 md:h-16"
              />
            </a>
          </Link>
        </div>

        {/* NavBar */}
        <div className="flex-grow hidden md:block">
          {isLoggedIn && <NavBar />}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden absolute right-4 top-4"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* User Info/Auth Buttons */}
        <div className={`flex-1 flex justify-center space-x-4 items-center ${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex`}>
    {/* Theme Toggle Button */}
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        // Sun icon for light mode
        <svg 
          className="w-6 h-6 text-gray-800 dark:text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg 
          className="w-6 h-6 text-gray-800 dark:text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      )}
    </button>
          {isLoggedIn ? (
            <div className="relative group">
              <div className="flex items-center cursor-pointer nav-link">
                <img
                  src={userPic}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full mr-2"
                />
                <span className="flex items-center text-lg font-medium">
                  Hello, {userName}
                  <span className="dropdown-indicator"></span>
                </span>
              </div>
              <div className="dropdown-menu">
                <ul>
                  <li>
                    <Link href="/profile" legacyBehavior>
                      <a className="dropdown-link">Profile</a>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-link text-left w-full"
                    >
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <Link href="/auth/login" legacyBehavior>
                <a className="btn login-btn">Login</a>
              </Link>
              <Link href="/auth/register" legacyBehavior>
                <a className="btn register-btn">Sign Up</a>
              </Link>
            </>
          )}
        </div>

        {/* Mobile NavBar */}
        {isLoggedIn && isMobileMenuOpen && (
          <div className="md:hidden w-full mt-4">
            <NavBar />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;