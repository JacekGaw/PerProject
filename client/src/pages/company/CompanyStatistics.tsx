import React, {useEffect, useState} from "react";
import { useCompanyCtx, StatisticsType} from "../../store/CompanyContext";
import Spinner from "../../components/UI/Spinner";

const CompanyStatistics: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [stats, setStats] = useState<StatisticsType>();
    const {getCompanyStatistics} = useCompanyCtx();


    useEffect(() => {
        const loadStatistics = async () => {
            setLoading(true)
            const data = await getCompanyStatistics()
            setStats(data)
            setLoading(false)
        }
        loadStatistics();
        
    }, [getCompanyStatistics])

    return (
        <div className="flex justify-center items-center gap-24">
            <div className="flex flex-col justify-center items-center gap-2 p-5 ">
                {loading ? <Spinner /> :<p className="text-7xl font-[700]">{stats?.projects}</p> }
                <p className="font-[300] text-xl">projects.</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-2 p-5 ">
            {loading ? <Spinner /> :<p className="text-7xl font-[700]">{stats?.tasks}</p> }
                <p className="font-[300] text-xl">tasks.</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-2 p-5 ">
            {loading ? <Spinner /> :<p className="text-7xl font-[700]">{stats?.users}</p> }
            <p className="font-[300] text-xl">users.</p>
            </div>
        </div>
    )
}

export default CompanyStatistics;