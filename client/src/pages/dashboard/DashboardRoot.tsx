import React, {useContext} from "react";
import { AuthContext } from "../../store/AuthContext";
import Button from "../../components/UI/Button";

const DashboardRoot: React.FC = () => {
    const {logOut} = useContext(AuthContext);
    return (
        <>
            <h1>Hello User!</h1>
            <Button onClick={() => logOut()}>Log Out</Button>
        </>
    )
}

export default DashboardRoot