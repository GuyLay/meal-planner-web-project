import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-4">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 Plan & Plate. All rights reserved.</p>
        <p>
          <Link href="/about" legacyBehavior>
            <a className="hover:underline">
              About Us
            </a>
          </Link>{" "}
        </p>
      </div>
    </footer>
  );
};

export default Footer;