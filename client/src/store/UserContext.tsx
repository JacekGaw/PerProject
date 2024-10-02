import {
    ReactNode,Dispatch, SetStateAction,
    createContext,
    useState,
    useEffect,
    useContext
  } from "react";
  import { useAuth } from "./AuthContext";
import axios from "axios";

  interface UserObj {
    id: number;
    name: string;
    surname: string;
    admin: boolean;
    active: boolean;
    email: string;
    phone?: string;
    createdAt: string;
    role: "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other";
  }

  interface Bookmark {
    id: number,
    projectId: number,
    userId: number,
    addedAt: string
  }

  interface UserContextProps {
    user: UserObj | undefined,
    bookmarks: Bookmark[],
    setBookmarks: Dispatch<SetStateAction<Bookmark[]>>
  }
  
  export const UserContext = createContext<UserContextProps | undefined>(
    undefined
  );

  export const useUserCtx = () : UserContextProps => {
    const context = useContext(UserContext);
    if(context === undefined) {
      throw new Error("Project Context must be used within an ProjectContextProvider");
    }
    return context;
  }
  
  export const UserProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const { user } = useAuth();
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

    useEffect(() => {
      const getUserBookmarks = async () => {
        try {
          if(user){
            const response = await axios.get(`http://localhost:3002/api/user/${user.id}/bookmarks`);
            const bookmarks = response.data.data;
            setBookmarks(bookmarks);
            return ({status: "Success", data : bookmarks});
          }
          return {status: "Error", text: "User not defined"};
        } catch (err: any) {
          console.log(err);
          const errMessage = err.response?.data.message || err.message
          return {status: "Error", text: errMessage};
        }
      }
      getUserBookmarks();
    }, [user]);
    
  
    const ctxValue = {
        user,
        bookmarks,
        setBookmarks
    };
  
    return (
      <UserContext.Provider value={ctxValue}>
        {children}
      </UserContext.Provider>
    );
  };
  