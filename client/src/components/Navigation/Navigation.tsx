import React from 'react';
import { useAuth } from '../../store/AuthContext'; 
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navigation: React.FC = () => {
    const {user} = useAuth();
    if(!user) return  <Navigate to="/login" />;

    const userInitials = `${user.name[0].toUpperCase()}${user.surname[0].toUpperCase()}`;

    return(
        <>
            <nav className='h-screen p-5 flex flex-col justify-between items-center bg-darkest-blue'>
                <header>
                    <h1>PerP</h1>
                </header>
                <ul>

                </ul>
                <div>
                    <Link to="/user">
                        <motion.div
                        initial={{scale: 1, opacity: 0.8}}
                        whileHover={{scale: 1.1, opacity: 1}}
                        className="border-2 p-2 rounded-full">{userInitials}</motion.div>
                    </Link>
                </div>
            </nav>
        </>
    );
}

export default Navigation;