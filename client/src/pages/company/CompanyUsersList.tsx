import React, {useRef} from "react";
import { useCompanyCtx } from "../../store/CompanyContext";
import DateFormatted from "../../components/UI/DateFormatted";
import UserAvatar from "../../components/UI/UserAvatar";
import Button from "../../components/UI/Button";
import Modal, { ModalRef } from "../../components/UI/Modal";
import AddNewUser from "./AddNewUser";

const CompanyUsersList: React.FC = () => {
  const { companyUsers } = useCompanyCtx();
  const modalRef = useRef<ModalRef | null>(null);
  return (
    <>
    
    <Modal ref={modalRef}>
        <AddNewUser />
    </Modal>
      <div className="shadow-xl rounded-xl flex flex-col">
        <header className="rounded-t-xl flex justify-between items-center  bg-darkest-blue p-4">
          <h3 className="font-xl uppercase font-[500]">Users in company:</h3>
          <Button onClick={() => modalRef.current?.open()}>Add new</Button>
        </header>
        <ul className=" flex flex-col gap-1 max-h-[400px] ">
          {companyUsers.map((user) => {
            return (
              <li
                key={user.id}
                className="p-4 text-sm flex justify-between items-center"
              >
                <div className="flex-0 flex gap-2 items-center">
                  <UserAvatar user={user} />
                  <p>
                    {user.name} {user.surname}
                  </p>
                </div>
                <p>{user.email}</p>
                <p>{user.role}</p>
                
                <p>{user.active ? "ACTIVE" : "INACTIVE"}</p>
                <p className="flex-0">
                  <DateFormatted dateObj={user.joinDate} />
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default CompanyUsersList;
