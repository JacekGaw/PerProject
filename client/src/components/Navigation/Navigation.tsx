import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to get the current route
import { useAuth } from "../../store/AuthContext";
import { Navigate } from "react-router-dom";
import projectsImg from "../../assets/img/projects.svg";
import notesImg from "../../assets/img/notes.svg";
import tasksImg from "../../assets/img/tasks.svg";
import homeImg from "../../assets/img/home.svg";
import NavigationItem from "./NavigationItem";
import NavigationSettings from "./NavigationSettings";
import companyImg from "../../assets/img/company.svg";

const navigationTabs = [
  {
    link: "/dashboard",
    title: "Dashboard",
    tabImage: homeImg,
  },
  {
    link: "/dashboard/projects",
    title: "Projects",
    tabImage: projectsImg,
  },
  // {
  //   link: "/dashboard/notes",
  //   title: "Notes",
  //   tabImage: notesImg,
  // },
  {
    link: "/dashboard/tasks",
    title: "Tasks",
    tabImage: tasksImg,
  },
  {
    link: "/dashboard/company",
    title: "Company",
    tabImage: companyImg,
  },
];

const Navigation: React.FC = () => {
  const [selected, setSelected] = useState<number>(0);
  const { user } = useAuth();
  const location = useLocation(); // Get current route

  // Set the selected tab based on the current route
  useEffect(() => {
    const currentTabIndex = navigationTabs.findIndex(tab => tab.link === location.pathname);
    if (currentTabIndex !== -1) {
      setSelected(currentTabIndex);
    }
  }, [location.pathname]); // Run this effect when the route changes

  if (!user) return <Navigate to="/login" />;
  const userInitials = "PP"; // Placeholder for user initials

  return (
    <>
      <nav className="h-screen fixed w-[60px] py-5 flex flex-col justify-between items-center bg-darkest-blue">
        <header>
          <h1>PerP</h1>
        </header>
        <ul>
          {navigationTabs.map((item, index) => (
            <NavigationItem
              key={item.title}
              link={item.link}
              image={item.tabImage}
              title={item.title}
              selected={selected === index}
              onClick={() => setSelected(index)} // Handle clicking on nav items
            />
          ))}
        </ul>
        <NavigationSettings initials={userInitials} />
      </nav>
    </>
  );
};

export default Navigation;
