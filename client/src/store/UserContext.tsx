import {
  ReactNode,
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

export interface UserObj {
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
  id: number;
  projectId: number;
  userId: number;
  addedAt: string;
}

interface UserContextProps {
  user: UserObj | undefined;
  bookmarks: Bookmark[];
  setBookmarks: Dispatch<SetStateAction<Bookmark[]>>;
  getUserBookmarks: () => Promise<{
    status: string;
    data?: Bookmark[];
    text?: string;
  }>;
  changeUser: (
    data: Partial<UserObj>,
    userId: number | undefined
  ) => Promise<{ status: string; text: string }>;
  userInfo: UserObj | undefined;
  changeUserPassword: (
    data: { oldPassword: string; newPassword: string },
    userId?: number
  ) => Promise<{ status: string; text: string }>;
  deleteUser: (userId?: number) => Promise<{ status: string; text: string }>;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

export const useUserCtx = (): UserContextProps => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(
      "Project Context must be used within an ProjectContextProvider"
    );
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, logOut } = useAuth();
  const [userInfo, setUserInfo] = useState<UserObj>();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    getUserInfo();
    getUserBookmarks();
  }, []);

  const getUserInfo = async () => {
    if (user) {
      try {
        const response = await axios.get(
          `/api/users/${user.id}`
        );
        if (response.data.user[0]) {
          console.log(response);
          setUserInfo(response.data.user[0]);
          return { status: "Success", text: "Get user info" };
        }
        return { status: "Error", text: "Could't get user info" };
      } catch (err: any) {
        console.log(err);
        const errMessage = err.response?.data.message || err.message;
        return { status: "Error", text: errMessage };
      }
    }
  };

  const getUserBookmarks = async () => {
    try {
      if (user) {
        const response = await axios.get(
          `/api/user/${user.id}/bookmarks`
        );
        const bookmarks = response.data.data;
        setBookmarks(bookmarks);
        return { status: "Success", data: bookmarks };
      }
      return { status: "Error", text: "User not defined" };
    } catch (err: any) {
      console.log(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const changeUser = async (data: Partial<UserObj>, userId: number | undefined) => {
    if (userId === undefined) {
      return { status: "Error", text: "User ID is required" };
    }
    try {
      const userChanged = await axios.patch(
        `/api/users/${userId}`,
        data
      );
      if (userChanged) {
        setUserInfo(userChanged.data.data);
        return { status: "Success", text: "User updated successfully" };
      }
      return { status: "Error", text: "Cannot change user" };
    } catch (err: any) {
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const changeUserPassword = async (
    data: { oldPassword: string; newPassword: string },
    userId: number | undefined
  ) => {
    try {
      const userChanged = await axios.patch(
        `/api/users/${userId}/change-password`,
        data
      );
      if (userChanged) {
        return {
          status: "Success",
          text: "User password updated successfully",
        };
      }
      return { status: "Error", text: "Cannot change user password" };
    } catch (err: any) {
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const deleteUser = async (userId: number | undefined) => {
    try {
      const deletedUser = await axios.delete(
        `/api/users/${userId}`
      );
      if (deletedUser) {
        if (user && user.id == userId) {
          logOut();
        }
        return {
          status: "Success",
          text: "User deleted successfully",
        };
      }
      return { status: "Error", text: "Cannot delete user" };
    } catch (err: any) {
      console.error(err);
      const errMessage = err.response?.data.message || err.message;
      return { status: "Error", text: errMessage };
    }
  };

  const ctxValue = {
    user,
    bookmarks,
    setBookmarks,
    getUserBookmarks,
    changeUser,
    userInfo,
    changeUserPassword,
    deleteUser,
  };

  return (
    <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>
  );
};
