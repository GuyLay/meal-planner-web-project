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

  const listDisplay = (list) => {
    return (
      <div key={list._id} className="bg-white rounded-lg shadow-md p-6 relative">
              <div className="absolute right-2 top-2 text-red-500 font-bold text-3xl cursor-pointer group z-10">
              <button
                onClick={() => handleDelete(list._id)}
                className=""
                aria-label="Delete"
              >
                &times;
              </button>
              <button onClick={() => handlePrint(list)}
                className="">
                <img src="/print.svg" class="pl-2" style={{height: '1rem'}}></img>
              </button>
              </div>
              
   
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mr-8">
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
  }

  const handlePrint = (list) => {
    // Define inline styles for the print window
    const styles = `
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        background-color: #ffffff;
        color: #2b2929;
        text-align: center;
      }
      
      .printList {
        background-color: white;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        text-align: center;
      }
      
      .printList h1 {
        font-size: 1.25rem;
        font-weight: 600;
      }
      
      .printList-time {
        color: #6b7280;
        font-size: 0.875rem;
        margin-bottom: 1rem;
      }
  
      ul {
        list-style-type: disc;
        width: 60%;
        margin: 0 auto;
        padding-left: 40px;
        box-sizing: border-box;
      }
      
      .list-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        padding-left: 10px;
      }
      
      .list-item span {
        font-size: 14px;
      }
    `;
  
    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  
    // Build the HTML content
    const content = `
      <html>
        <head>
          <title>Print Shopping List</title>
          <style>${styles}</style>
        </head>
        <body>
          <div class="printList">
            <h1>${escapeHtml(list.recipeName)}</h1>
            <div class="printList-time">
              Created: ${new Date(list.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <hr/>
            <br/>
            <ul>
              ${list.items
                .map(
                  (item) => `
                    <li class="list-item">
                      <span>${escapeHtml(item.ingredientName)}</span>
                      <span>${escapeHtml(item.amount)} ${escapeHtml(item.unit)}</span>
                    </li>
                  `
                )
                .join("")}
            </ul>
          </div>
        </body>
      </html>
    `;
  
    // Helper function to escape HTML special characters
    function escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  
    // Write content to iframe and print
    iframe.contentDocument.write(content);
    iframe.contentDocument.close();
    
    // Wait for styles to load
    setTimeout(() => {
      iframe.contentWindow.print();
      // Remove iframe after printing
      document.body.removeChild(iframe);
    }, 250);
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

  if (loading) return (
    <div className="container flex justify-center items-center mx-auto py-8" style={{ height: '60vh' }}>
      <img src="/loading.gif" alt="loading" style={{ height: '70%', width: '70%' }} />
    </div>
  );

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
      <div className="oneList space-y-8">
        {shoppingLists.map((list) => {
          console.log("Rendering list:", list);
          return (
            listDisplay(list)
          );
        })}
      </div>
    </div>
   );
}