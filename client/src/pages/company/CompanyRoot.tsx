import React, { useState } from "react";
import { useCompanyCtx } from "../../store/CompanyContext";
import CompanyUsersList from "./CompanyUsersList";
import CompanyStatistics from "./CompanyStatistics";
import CompanySettings from "./CompanySettings";

const CompanyRoot: React.FC = () => {
    const { company} = useCompanyCtx();
    const [selectedView, setSelectedView] = useState<number>(0);

    const menuViews = [
      {
        label: "Overal",
        component: <CompanyStatistics />
      },
      {
        label: "Users",
        component: <CompanyUsersList />
      },
      {
        label: "Settings",
        component: <CompanySettings />
      },
    ]

    return (
        <>
        <section className="w-full max-w-screen-xl mx-auto gap-10 flex flex-col">
      <header className="w-full border-b py-5 flex justify-between gap-2 items-center">
        <h1 className="font-[800] text-slate-200 text-2xl">Company</h1>
      </header>
      <div className="flex flex-col gap-10">
        <header className="flex justify-center items-center flex-col gap-2 max-w-screen-sm mx-auto">
            <h2 className="font-[600] text-5xl">{company?.name}</h2>
            <p className="font-[200] text-xl" >{company?.description}</p>
            <div>
        {/* <p className="font-[300] text-xl text-slate-800 inline-flex">
          From: <DateFormatted dateObj={new Date(company!.createdAt)} />{" "} 
        </p> */}
      </div>
        </header>
        <div className="flex flex-col gap-2">
        <div className="w-full flex justify-center items-center border-b border-slate-400 flex-nowrap">
          {menuViews.map((item, index) => (
            <button key={item.label} onClick={() => setSelectedView(index)} className="px-10 py-2 text-lg">{item.label}</button>
          ))}
        </div>
        {menuViews[selectedView].component}
        </div>
      </div>
      </section>
        </>
    )
}

export default CompanyRoot;