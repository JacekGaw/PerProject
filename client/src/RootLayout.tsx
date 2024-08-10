import { Outlet } from "react-router-dom";

const RootLayout = () => {
    return (
        <main className="w-full h-screen min-h-screen flex items-center justify-center">
            <Outlet />
        </main>
    )
}

export default RootLayout;