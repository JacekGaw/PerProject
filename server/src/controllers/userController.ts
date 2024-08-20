import { Request, Response, RequestHandler } from "express";
import { getUsersFromDB, getUserFromDB, createUserInDB, deleteUserFromDb, updateUserInDB } from "../services/userServices.js";
// import { asyncHandler } from '../utils/asyncHandler.js';

// export const getUsers = asyncHandler(async (req: Request, res: Response) => {
//     const usersList = await db.query.users.findMany();
//     console.log(usersList);

//     res.status(200).json({
//       message: "Getting all users",
//       users: usersList,
//     });
//   });

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const usersList = await getUsersFromDB();
    console.log("Getting all users ", usersList);
    res.status(200).json({
      message: "Getting all users",
      users: usersList,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const getUser: RequestHandler = async (req, res) => {
  try {
    const singleUser = await getUserFromDB(parseInt(req.params.id));
    console.log("Getting single user ",singleUser);
    res.status(200).json({
      message: "Getting single user",
      user: singleUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const createUser: RequestHandler = async (req, res) => {
    try {
      const {email, password, role} = req.body; 
      if(!email || !password || !role){
        res.status(400).json({
            message: "Did not provide all requested user informations"
          });
      }
      const newUser = await createUserInDB(email, password, role as "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other");
      console.log("Created user", newUser);
      res.status(200).json({
        message: "Created single user",
        user: newUser,
      });
    } catch (err) {
      res.status(500).json({
        message: "Error",
        error: (err as Error).message || "Unknown error",
      });
    }
  };

  export const deleteUser: RequestHandler = async (req, res) => {
    try {
      const deletedUser = await deleteUserFromDb(parseInt(req.params.id));
      console.log("Deleted user ",deletedUser);
      res.status(200).json({
        message: "Deleted single user",
        user: deletedUser,
      });
    } catch (err) {
      res.status(500).json({
        message: "Error",
        error: (err as Error).message || "Unknown error",
      });
    }
  };

  export const updateUser: RequestHandler = async (req, res) => {
    try {
        const data = req.body

      const updatedUser = await updateUserInDB(data, parseInt(req.params.id));
      console.log("Updated user ", updatedUser);
      res.status(200).json({
        message: "Updated single user",
        user: updatedUser,
      });
    } catch (err) {
      res.status(500).json({
        message: "Error",
        error: (err as Error).message || "Unknown error",
      });
    }
  };

