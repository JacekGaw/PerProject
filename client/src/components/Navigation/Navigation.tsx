import React, { useState } from "react";
import { useAuth } from "../../store/AuthContext";
import { Navigate, Link } from "react-router-dom";
import projectsImg from "../../assets/img/projects.svg";
import notesImg from "../../assets/img/notes.svg";
import tasksImg from "../../assets/img/tasks.svg";
import homeImg from "../../assets/img/home.svg";
import NavigationItem from "./NavigationItem";
import NavigationSettings from "./NavigationSettings";
import companyImg from "../../assets/img/company.svg"

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
  {
    link: "/dashboard/notes",
    title: "Notes",
    tabImage: notesImg,
  },
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
  if (!user) return <Navigate to="/login" />;

  const userInitials = `${user.name[0].toUpperCase()}${user.surname[0].toUpperCase()}`;

  return (
    <>
      <nav className="h-screen sticky py-5 flex flex-col justify-between items-center bg-darkest-blue">
        <header>
          <h1>PerP</h1>
        </header>
        <ul>
          {navigationTabs.map((item, index) => {
            return (
              <NavigationItem
                key={item.title}
                link={item.link}
                image={item.tabImage}
                title={item.title}
                selected={selected == index}
                onClick={() => setSelected(index)}
              />
            );
          })}
        </ul>
        <NavigationSettings initials={userInitials} />
      </nav>
    </>
  );
};

export default Navigation;
