import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ShoppingList() {
  const router = useRouter();
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (listId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(
        `/api/shopping-list/delete?listId=${listId}&userId=${user.email}`,
        { method: "DELETE" }
      );
  
      if (response.ok) {
        // Remove the deleted list from state
        setShoppingLists((prev) => prev.filter(list => list._id !== listId));
      } else {
        console.error("Failed to delete shopping list");
      }
    } catch (error) {
      console.error("Error deleting shopping list:", error);
    }
  };

  useEffect(() => {
    const fetchShoppingLists = async () => {
      const user = localStorage.getItem('user') ? 
        JSON.parse(localStorage.getItem('user')) : null;

      console.log("User from localStorage:", user);

      if (!user) {
        router.push('/auth/login');
        return;
      }

      try {
        console.log("Fetching for user:", user.email);
        const response = await fetch(`/api/shopping-list/display?userId=${user.email}`);
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Shopping Lists Data:", data); // Debug log
        
        if (!Array.isArray(data)) {
          console.error("Expected array but got:", typeof data);
          setShoppingLists([]);
          return;
        }

        // Check each list's structure
        data.forEach((list, index) => {
          console.log(`List ${index}:`, {
            id: list._id,
            name: list.recipeName,
            items: list.items,
            createdAt: list.createdAt
          });
        });

        setShoppingLists(data);
      } catch (error) {
        console.error('Error fetching shopping lists:', error);
        setShoppingLists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShoppingLists();
  }, [router]);

  // Log when rendering
  console.log("Current shoppingLists state:", shoppingLists);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  if (shoppingLists.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Shopping List</h1>
        <p className="text-gray-600">Your shopping list is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Shopping List</h1>
      <div className="space-y-8">
        {shoppingLists.map((list) => {
          console.log("Rendering list:", list);
          return (
            <div
              key={list._id}
              className="bg-white rounded-lg shadow-md p-6 relative"
            >
              <button
                onClick={() => handleDelete(list._id)}
                className="absolute right-2 top-2 text-red-500 font-bold text-3xl cursor-pointer group z-10"
                aria-label="Delete"
              >
                &times;
                <span className="absolute top-full right-6 transform translate-x-1/2 mt-1 w-max bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Remove
                </span>
              </button>
   
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {list.recipeName}
                </h2>
                <span className="text-sm text-gray-500">
                  {formatDate(list.createdAt)}
                </span>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {list.items && list.items.map((item, index) => {
                  console.log("Rendering item:", item);
                  return (
                    <li
                      key={index}
                      className="py-3 flex justify-between items-center"
                    >
                      <span className="text-gray-800">
                        {item.ingredientName}
                      </span>
                      <span className="text-gray-600">
                        {item.amount} {item.unit}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
   );
}