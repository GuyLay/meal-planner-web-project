import React from "react";

const Home = () => {
  return (
    <main className="flex-grow container mx-auto py-8 dark:bg-gray-900 transition-colors duration-200">
      <section className="flex flex-col lg:flex-row items-center justify-center gap-16 py-20 px-8">
        {/* Text Section */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-6xl font-extrabold leading-tight mb-8 text-gray-800 dark:text-white">
            Welcome to Plan & Plate!
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Explore a world of delicious recipes and effective meal planning tools.
            Get started today and elevate your cooking experience.
          </p>
        </div>
        {/* Image Section */}
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="../images/Homepage.jpeg"
            alt="Plan & Plate App Preview"
            className="max-w-md lg:max-w-lg rounded-lg shadow-md dark:shadow-gray-700"
          />
        </div>
      </section>
    </main>
  );
};

export default Home;