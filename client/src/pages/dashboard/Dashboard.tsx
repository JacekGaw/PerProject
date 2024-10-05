import React from 'react';
import DashboardCard from '../../components/UI/DashboardCard';
import Greeting from './Greeting';
import Timer from './Timer';
import UserProjects from './UserProjects';
import UserTasks from './UserTasks';


const Dashboard: React.FC = () => {

    return (
        <>
            <div className='w-full max-w-screen-2xl mx-auto flex flex-col justify-center items-center gap-5'>
                <header className='w-full py-3 border-b border-slate-400'>
                    <h1 className='font-[800] text-3xl text-slate-200'>Dashboard</h1>
                </header>
                <div className='w-full grid grid-cols-6 gap-5'>
                    <DashboardCard className={"col-span-4 flex justify-center items-center"}>
                        <Greeting />
                    </DashboardCard>
                    <DashboardCard className={"col-span-2 flex justify-center items-center"} >
                        <Timer />
                    </DashboardCard>
                    <DashboardCard className={"col-span-3"}>
                        <UserProjects />
                    </DashboardCard>
                    <DashboardCard className={"col-span-3"}>
                        <UserTasks />
                    </DashboardCard>
                </div>
            </div>
        </>
    )
}

export default Dashboard;