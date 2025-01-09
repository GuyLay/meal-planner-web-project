import React from "react";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="flex-grow">
      <ul className="flex justify-center space-x-8 text-lg font-medium">
        <li>
          <Link href="/" legacyBehavior>
            <a className="nav-link">Home</a>
          </Link>
        </li>
        <li className="relative group">
          <Link href="/recipes/all-recipes" legacyBehavior>
            <a className="nav-link nav-link-with-dropdown">
              Recipes <span className="dropdown-indicator"></span>
            </a>
          </Link>
          <div className="dropdown-menu">
            <ul>
              <li>
                <Link href="/recipes/all-recipes" legacyBehavior>
                  <a className="dropdown-link">All Recipes</a>
                </Link>
              </li>
              <li>
                <Link href="/recipes/Salad" legacyBehavior>
                  <a className="dropdown-link">Salads</a>
                </Link>
              </li>
              <li>
                <Link href="/recipes/Main-Dish" legacyBehavior>
                  <a className="dropdown-link">Main Dish</a>
                </Link>
              </li>
              <li>
                <Link href="/recipes/Soup" legacyBehavior>
                  <a className="dropdown-link">Soups</a>
                </Link>
              </li>
              <li>
                <Link href="/recipes/recipes-creator" legacyBehavior>
                  <a className="dropdown-link" data-restricted="true">
                    Add New Recipe
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <Link href="/meal-planner" legacyBehavior>
            <a className="nav-link" data-restricted="true">
              Meal Planner
            </a>
          </Link>
        </li>
        <li>
          <Link href="/shopping-list" legacyBehavior>
            <a className="nav-link" data-restricted="true">
              Shopping List
            </a>
          </Link>
        </li>
        <li>
          <Link href="/saved" legacyBehavior>
            <a className="nav-link" data-restricted="true">
              Saved
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;