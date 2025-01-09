import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Form from "../../components/Form";

/**
 * Register component - Handles user registration functionality
 * including form validation, submission, and user feedback
 */
export default function Register() {
  // Initialize router for page navigation
  const router = useRouter();

  // Initialize form data state with empty values
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    foodPreferences: []
  });

  // State for modal handling (success/error messages)
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ type: '', message: '' });
  const [profileImage, setProfileImage] = useState(null);

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
  /**
   * Handles changes in text input fields
   * Updates the form state when user types in any input field
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handles changes in food preference checkboxes
   * Adds or removes preferences from the array based on checkbox state
   */
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      foodPreferences: checked 
        ? [...prev.foodPreferences, value]  // Add preference if checked
        : prev.foodPreferences.filter(pref => pref !== value)  // Remove if unchecked
    }));
  };

  /**
   * Validates form data before submission
   * Checks email format and password length
   */
  const validateForm = () => {
    // Validate email format
    if (!formData.email.includes('@')) {
      setModalContent({
        type: 'error',
        message: 'Please enter a valid email address'
      });
      setShowModal(true);
      return false;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setModalContent({
        type: 'error',
        message: 'Password must be at least 6 characters long'
      });
      setShowModal(true);
      return false;
    }
    return true;
  };

  /**
   * Handles form submission
   * Validates form data and sends it to the API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    try {
      // Convert image to base64 if one was selected
      let base64Image = "";
      if (profileImage) {
        base64Image = await toBase64(profileImage);
      }
  
      // Send POST request to registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          profileImage: base64Image
        })
      });
  
      const data = await response.json();
  
      if (data.success) {
        setModalContent({
          type: 'success',
          message: 'Registration successful! Welcome to Plan & Plate!'
        });
        setShowModal(true);
        
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      setModalContent({
        type: 'error',
        message: error.message || 'Registration failed. Please try again.'
      });
      setShowModal(true);
    }
  };

  return (
    <>
      <main className="flex-grow container mx-auto py-8">
        <section className="form-section py-8 flex justify-center">
          <Form title="Create Your Account" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="firstName"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Enter password [at least 6 characters]"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="profileImage"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Profile Picture
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/jpeg, image/png"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
              <p className="text-sm text-gray-500 mt-1">Supported formats: JPG, PNG.</p>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Food Preferences
              </label>
              <div className="space-y-3 bg-gray-50 border border-gray-300 rounded-lg p-3">
                {["Side-Dishes", "Soup", "Salad", "Main-Dish", "Dessert"].map((preference) => (
                  <div key={preference} className="flex items-center">
                    <input
                      type="checkbox"
                      id={preference}
                      name="foodPreferences"
                      value={preference}
                      checked={formData.foodPreferences.includes(preference)}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label
                      htmlFor={preference}
                      className="ml-2 text-sm text-gray-900"
                    >
                      {preference.charAt(0).toUpperCase() + preference.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button type="submit" className="btn">
                Sign Up
              </button>
            </div>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account? <Link href="/auth/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Log in</Link>
            </p>
          </Form>
        </section>
      </main>
  
      {showModal && (
        <div className="modal-overlay">
          <div className={`modal ${modalContent.type === "success" ? "success-modal" : "error-modal"}`}>
            <p>{modalContent.message}</p>
            <button onClick={() => setShowModal(false)} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}