import React, {useRef} from "react";
import DateFormatted from "../../components/UI/DateFormatted";
import Button from "../../components/UI/Button";
import Modal, {ModalRef} from "../../components/UI/Modal";
import ChangeAccoundDetails from "./ChangeAccoundDetails";
import { useUserCtx } from "../../store/UserContext";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";

const UserRoot: React.FC = () => {
  const { userInfo } = useUserCtx();
  const changeAccountDetaisRef = useRef<ModalRef>(null)
  const changePasswordRef = useRef<ModalRef>(null)
  const deleteAccountRef = useRef<ModalRef>(null)

  return (
    <>
        <Modal ref={changeAccountDetaisRef}><ChangeAccoundDetails user={userInfo!} /></Modal>
        <Modal ref={changePasswordRef}><ChangePassword user={userInfo!} /></Modal>
        <Modal ref={deleteAccountRef}><DeleteAccount user={userInfo!} /></Modal>
      <section className="w-full max-w-screen-xl mx-auto gap-10 flex flex-col">
        <header className="w-full border-b py-5 flex justify-between gap-2 items-center">
          <h1 className="font-[800] text-slate-200 text-2xl">User</h1>
        </header>
        <div className="flex  w-full  items-start gap-10">
          <div className="flex w-full p-10 bg-darkest-blue rounded-xl flex-col gap-5">
            <DateFormatted
              dateObj={new Date(userInfo!.createdAt)}
              label="Created At: "
            />
              <h3 className="text-6xl ">
                {userInfo?.name} {userInfo?.surname}
              </h3>
              <p className="text-3xl uppercase text-slate-400 font-[200]">{userInfo?.role}</p>
              <p className="text-3xl text-slate-400 font-[200]">{userInfo?.email}</p>
            
              <p className="text-3xl text-slate-400 font-[200]">{userInfo?.phone}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={ () => changeAccountDetaisRef.current?.open()}>Change account details</Button>
            <Button onClick={ () => changePasswordRef.current?.open()}>Change password</Button>
            <Button onClick={ () => deleteAccountRef.current?.open()}>Delete account</Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserRoot;
