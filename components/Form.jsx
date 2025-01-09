import React from "react";

const Form = ({ title, children, onSubmit }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
          {title}
        </h1>
        <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
          {children}
        </form>
      </div>
    </div>
  );
};

export default Form;