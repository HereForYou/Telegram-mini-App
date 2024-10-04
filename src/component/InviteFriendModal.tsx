import { BOT_URL } from "../data";

const InviteFriendModal = ({
  showModal,
  inviteLink,
  desText,
  handleClipBoardCopy,
  setShowModal,
  setLimiteModal,
}: any) => {
  return (
    <div
      className={`absolute bg-[#4b37dd] z-50 rounded-xl flex flex-col w-full right-0 text-white px-4 py-2 pb-8 gap-2 transition-all duration-500 ease-out transform ${
        showModal ? "bottom-[60px]" : "bottom-[-400px]"
      }`}>
      <div className='w-full flex flex-col gap-2'>
        <div className='h-[5px] rounded-full w-[80px] bg-black opacity-80 self-center' />
        <h2 className='text-2xl text-white font-bold'>Invite Friends</h2>
      </div>
      <h4 className='text-base text-gray opacity-70'>
        You have <span className='text-yellow-400 font-bold'>Unlimited</span> invitations available
      </h4>
      <a
        href={`https://t.me/share/url?url=${BOT_URL}?startapp=${inviteLink}&text=${desText}`}
        target='blank'
        className='bg-[#110d33] p-1 rounded-xl text-white font-semibold transition relative duration-200 hover:translate-y-[2px]'>
        <div className=' cursor-pointer py-2 hover:text-[#4b37dd] rounded-xl'>
          {/* <FontAwesomeIcon icon={faPaperPlane} className='mr-5' /> */}
          Send
        </div>
      </a>
      <div className='bg-[#110d33] p-1 text-white font-semibold rounded-xl transition relative duration-200 hover:translate-y-[2px]'>
        <p onClick={handleClipBoardCopy} className=' cursor-pointer hover:text-[#4b37dd] py-2 rounded-xl '>
          {/* <FontAwesomeIcon icon={faClone} className='mr-5' /> */}
          Copy Link
        </p>
      </div>
      <div className='bg-[#110d33] p-1 text-white font-semibold rounded-xl transition relative duration-200 hover:translate-y-[2px]'>
        <p onClick={() => setShowModal(false)} className=' cursor-pointer hover:text-[#4b37dd] py-2 rounded-xl '>
          Cancel
        </p>
      </div>
      <p
        className='text-left pl-1 cursor-pointer underline hover:text-white  transition-all duration-200'
        onClick={() => setLimiteModal(true)}>
        How is the referral reward calculated?
      </p>
    </div>
  );
};

export default InviteFriendModal;
