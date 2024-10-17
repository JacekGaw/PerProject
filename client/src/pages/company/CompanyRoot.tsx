import React from "react";
import { useCompanyCtx } from "../../store/CompanyContext";
import CompanyUsersList from "./CompanyUsersList";
import CompanyStatistics from "./CompanyStatistics";

const CompanyRoot: React.FC = () => {
    const { company} = useCompanyCtx();

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
        </header>
        <CompanyStatistics />
        <CompanyUsersList />
      </div>
      </section>
        </>
    )
}

export default CompanyRoot;