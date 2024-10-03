import React, { useState, useMemo } from "react";
import axios from "axios";
import { ENDPOINT } from "../data";
import Channel from "../component/Channel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "../App.css";
// import WalletConnect from "../component/WalletConnect";
import ClaimCard from "../component/ClaimCard";
import { formatNumberWithCommas } from "../utils/functions";
import Loader from "../component/Loader";
import Tap from "../component/Tap";
import { ChannelData } from "../utils/constants";
import TimeCount from "../component/TimeCount";
import { useTimeContext } from "../context/TimeContextProvider";
import JoinBuffyModal from "../component/JoinBuffyModal";

interface IHomeProps {
  setTab: (status: string) => void;
  setTitle: (status: string) => void;
  isNewUser: boolean;
  user: any;
}
const Exchange: React.FC<IHomeProps> = ({ setTab, setTitle, user, isNewUser }) => {
  const [claim, setClaim] = useState(false);
  const [points, setPoints] = useState(29857775);
  const { rank, totalPoints } = useTimeContext();
  const [isModal, setIsModal] = useState(isNewUser);

  const handleFollow = () => {
    console.log("This is handleFollow function!!!");
    axios
      .put(`${ENDPOINT}/api/user/task/${user?.id}`, {
        id: "twitter",
        profit: 1000,
      })
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.error("er", err);
      });
    window.open("https://twitter.com/BuffyDrop", "_blank");
  };

  const formattedTotalPoints = useMemo(() => {
    return formatNumberWithCommas(totalPoints);
  }, [totalPoints]);

  return (
    <div className='h-[calc(100%-50px)] items-center gap-2 overflow-y-auto w-full overflow-x-hidden hiddenScrollBar relative'>
      <div className={`bg-[#046ae2] flex gap-1 px-6 pt-5 pb-10 w-full justify-between items-center ${isModal && 'blur-md opacity-30'}`}>
        <div className='flex gap-2'>
          <img src='/x.svg' className='w-10' loading='lazy' />
          <div className='flex flex-col text-white text-left justify-center text-xs sm:text-sm'>
            <p>Post a tweet about Buffy on X</p>
            <p>and receive extra rewards.</p>
          </div>
        </div>
        <div
          onClick={handleFollow}
          className='bg-white text-black rounded-full px-3 h-fit py-1 text-sm font-semibold hidden sm:block cursor-pointer'>
          Post on X
        </div>
        <div
          onClick={handleFollow}
          className='bg-white text-black rounded-full px-3 h-fit py-1 text-sm font-semibold block sm:hidden cursor-pointer'>
          Post
        </div>
      </div>
      <div className={`relative rounded-2xl -top-5 w-full flex justify-between pt-5 px-5 gap-2 items-center flex-col bg-black exchange-content ${isModal && 'blur-md opacity-30'}`}>
        <div className='flex flex-col gap-4 justify-evenly w-full items-center h-full'>
          {claim && (
            <ClaimCard userId={user?.id} handleClose={() => setClaim(false)} />
          )}
          {/* <div>
            <WalletConnect />
          </div> */}
          <p className='text-lg xxs:text-2xl text-[#acacac] font-semibold bg-gradient-to-t from-[#444444] to-[#bdbdbd] bg-clip-text text-transparent'>
            You’re user {rank} to join the BuffyDrop!
          </p>
          <Tap points={points} setPoints={setPoints} />
          <div>
            {formattedTotalPoints == "NaN" ? (
              <div className='flex items-center justify-center w-full'>
                <Loader width='30' />
              </div>
            ) : (
              <p className='xxs:text-3xl text-2xl font-semibold'>{formattedTotalPoints}</p>
            )}
            <p className='xxs:text-xl text-lg text-[#acacac]'>$BUFFY</p>
          </div>
          <div className='w-full'>
            <div className='flex flex-row w-full'>
              <Carousel
                className='carousel-card relative flex -left-[11%] overflow-visible'
                infiniteLoop={true}
                showArrows={false}
                showIndicators={true}
                showStatus={false}
                centerMode
                centerSlidePercentage={80}
                showThumbs={false}
                useKeyboardArrows={false}
                autoPlay={false}
                stopOnHover={false}
                swipeable={true}
                dynamicHeight={false}
                emulateTouch={true}
                transitionTime={900}
                autoFocus={false}>
                {ChannelData.map((idx, key) => (
                  <Channel
                    id={idx.id}
                    heading={idx.title}
                    comment={idx.comment}
                    src={idx.src}
                    key={key}
                    setTab={setTab}
                    setTitle={setTitle}
                    btnTitle={idx.btnTitle}
                  />
                ))}
              </Carousel>
            </div>
            <TimeCount />
          </div>
        </div>
        {/* <button
          className='bg-[#110d33] w-full py-4 leading-none mt-4'
          onClick={() => setClaim(true)}>
          Claim hints
        </button> */}
      </div>
      {isModal && <JoinBuffyModal setIsModal={setIsModal} />}
    </div>
  );
};
export default Exchange;
