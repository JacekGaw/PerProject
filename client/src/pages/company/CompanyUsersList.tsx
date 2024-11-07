import React, {useRef} from "react";
import { useCompanyCtx } from "../../store/CompanyContext";
import Button from "../../components/UI/Button";
import Modal, { ModalRef } from "../../components/UI/Modal";
import AddNewUser from "./AddNewUser";
import CompanyUsersListItem from "./CompanyUsersListItem";

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
              <CompanyUsersListItem key={user.email} user={user} />
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default CompanyUsersList;
