import React, { useRef } from "react";
import { CompanyUserType } from "../../store/CompanyContext";
import DateFormatted from "../../components/UI/DateFormatted";
import UserAvatar from "../../components/UI/UserAvatar";
import moreIcon from "../../assets/img/vertical_dots.svg";
import Modal, { ModalRef } from "../../components/UI/Modal";
import DeleteAccount from "../user/DeleteAccount";

const CompanyUsersListItem: React.FC<{ user: CompanyUserType }> = ({
  user,
}) => {
  const modalRef = useRef<ModalRef | null>(null);
  return (
    <>
      <Modal ref={modalRef}>
        <DeleteAccount userObject={user} />
      </Modal>
      <li className="p-4 text-sm flex gap-5 justify-between items-center">
        <div className="flex-0 flex gap-2 items-center">
          <UserAvatar user={user} />
          <p>
            {user.name} {user.surname}
          </p>
        </div>
        <p className="flex-1">{user.email}</p>
        <p>{user.role}</p>

        <p>{user.active ? "ACTIVE" : "INACTIVE"}</p>
        <p className="flex-0">
          <DateFormatted dateObj={user!.joinDate} />
        </p>
        <div className="group relative">
          <button className="flex justify-center items-center p-2 z-10">
            <img src={moreIcon} alt="More user operations" className="h-6" />
          </button>
          <ul className="hidden group-hover:flex flex-col  absolute top-0 right-0  z-50 bg-darkest-blue">
            <li>
              <button
                className="w-full flex justify-center items-center p-2"
                onClick={() => modalRef.current?.open()}
              >
                Delete
              </button>
            </li>
            {/* <li>
              <button className="w-full flex justify-center items-center p-2">
                Edit
              </button>
            </li>
            <li>
              <button className="w-full flex justify-center items-center p-2">
                Deactivate
              </button>
            </li> */}
          </ul>
        </div>
      </li>
    </>
  );
};

export default CompanyUsersListItem;
