import { BrowserRouter as Router } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { injectSpeedInsights } from "@vercel/speed-insights";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import Exchange from "./page/Exchange";
import { useTelegram } from "./hooks/useTelegram";
import axios from "axios";
import { useTimeContext } from "./context/TimeContextProvider";
import { toast } from "react-hot-toast";
import Footer from "./component/Footer";
import Friends from "./page/Friends";
import Leaderboard from "./page/Leaderboard";
import { ENDPOINT } from "./data";
import Splash from "./page/Splash";
import Task from "./page/Task";
import Admin from "./page/Admin";
// import { isMobileDevice } from './utils/mobileDetect'
import { rankAvatarThemes } from "./utils/constants";
import LandingLoader from "./component/LandingLoader";
import NotFound from "./page/NotFount";
// const user = {
//   id: "7202566339",
//   username: "SmartFox",
//   first_name: "Olaf",
//   last_name: "",
// };
// const start_param = "";

function App() {
  const hasShownWarningRef = useRef(false);
  const { user, start_param } = useTelegram();
  const [inviteMsg, setInviteMsg] = useState<boolean>(false);
  const [task, setTask] = useState<string[]>([]);
  const [setting, setSetting] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>("Splash");
  const [title, setTitle] = useState<string>("");
  const [totalPoint, setTotalPoint] = useState<number>(0.0);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const {
    increasingAmout,
    isTimingStarted,
    // minedAmount,
    rank,
    remainTime,
    totalTime,
    setClaimed,
    setIncreasingAmount,
    setIsTimingStarted,
    setMinedAmount,
    setRank,
    setRemainTime,
    setTotalPoints,
    setTotalTime,
    setUserId,
  } = useTimeContext();

  useEffect(() => {
    injectSpeedInsights();
    // setIsMobile(isMobileDevice())
    if (!user) {
      hasShownWarningRef.current = true;
      axios
        .get(`${ENDPOINT}/api/setting/all`, {
          headers: {
            "ngrok-skip-browser-warning": "true", // or any value you prefer
          },
        })
        .then((res) => {
          setSetting(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    if (
      user &&
      !hasShownWarningRef.current &&
      (tab == "Exchange" || tab == "Splash")
    ) {
      if (tab == "Exchange") {
        hasShownWarningRef.current = true;
      }
      setUserId(user?.id.toString());
      let data = {
        userName: user?.username,
        firstName: user?.first_name,
        lastName: user?.last_name,
        start_param: start_param,
        style: rankAvatarThemes[Math.floor(Math.random() * 21)],
      };
      axios
        .get(`${ENDPOINT}/api/setting/all`, {
          headers: {
            "ngrok-skip-browser-warning": "true", // or any value you prefer
          },
        })
        .then((res) => {
          console.log("Initial Response Setting > ", res.data);
          setIncreasingAmount(res?.data?.dailyRevenue);
          setLoading(true);
          setSetting(res.data);
          axios
            .post(`${ENDPOINT}/api/user/${user?.id}`, data)
            .then((response) => {
              console.log("Initial Response > ", response);
              const passedTime = Math.round(response.data.remainTime);
              const userData = response.data.user;
              console.log(
                "passedTime",
                passedTime * increasingAmout,
                userData.cliamed
              );
              if (response.data.signIn) setTab("Exchange");
              setIsNewUser(!response.data.signIn);
              if (passedTime === 0 && userData.isStarted) {
                setMinedAmount(response?.data?.cycleTime * increasingAmout);
              }
              if (passedTime === 0 && !userData.isStarted) {
                setTotalTime(Number(response?.data?.cycleTime));
              }
              if (passedTime > 0) {
                setMinedAmount(passedTime * increasingAmout);
                setTotalTime(response?.data?.cycleTime - passedTime);
              }
              setIsTimingStarted(userData.isStarted);
              setClaimed(userData.cliamed);
              setTotalPoints(userData.totalPoints);
              setRank(response?.data?.user?.joinRank);
              setTask(userData.task);
              if (
                start_param &&
                !inviteMsg &&
                start_param != userData.inviteLink
              ) {
                toast.success("You are invited!");
                setInviteMsg(true);
              }
              setLoading(false);
            })
            .catch((error) => {
              setLoading(false);
              setTab("error");
              console.error("Error occurred during PUT request:", error);
            });
        })
        .catch((err) => {
          setLoading(false);
          setTab("error");
          console.error(err);
        });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (remainTime < totalTime && isTimingStarted) {
        duringMining();
      }
    }, 1000);
    if (remainTime === totalTime && totalTime !== 0) {
      endMining();
    }
    return () => {
      clearInterval(interval);
    };
  }, [remainTime, isTimingStarted]);

  const endMining = async () => {
    try {
      const res = await axios.post(`${ENDPOINT}/api/user/end/${user?.id}`);
      console.log("End Mining > minedAmount > ", res.data);
      setClaimed(res.data.user.cliamed);
      setIsTimingStarted(res.data.user.isStarted);
      setTotalTime(0);
    } catch (error) {
      console.error("Error ending mining:", error);
    }
  };

  const duringMining = () => {
    setRemainTime((prev) => prev + 1);
    setMinedAmount((prev) => prev + increasingAmout);
  };

  return (
    <Router>
      {loading ? (
        <LandingLoader />
      ) : user ? (
        <div
          className={`h-full relative max-h-screen overflow-hidden max-w-[560px] w-full font-roboto`}>
          <div className={`flex h-screen overflow-hidden pb-4 w-full`}>
            {tab == "Splash" && <Splash ranking={rank} setTab={setTab} />}
            {tab == "Exchange" && (
              <Exchange
                setTab={setTab}
                setTitle={setTitle}
                user={user}
                isNewUser={isNewUser}
              />
            )}
            {tab == "Friends" && (
              <Friends
                user={user}
                inviteRevenue={setting.inviteRevenue}
                modal={false}
              />
            )}
            {tab == "INVITE" && (
              <Friends
                user={user}
                inviteRevenue={setting.inviteRevenue}
                modal={true}
              />
            )}
            {tab == "error" && <NotFound />}
            {tab == "Channel" && (
              <Task
                title={title}
                user={user}
                totalPoint={totalPoint}
                setTotalPoint={setTotalPoint}
                setting={setting}
                task={task}
                setTask={setTask}
              />
            )}
            {tab == "Buffy" && (
              <Task
                title={tab}
                user={user}
                totalPoint={totalPoint}
                setTotalPoint={setTotalPoint}
                setting={setting}
                task={task}
                setTask={setTask}
              />
            )}
            {tab == "Leaderboard" && <Leaderboard user={user} />}
          </div>
          {tab !== "Splash" && tab !== "Admin" && tab !== "error" && (
            <Footer tab={tab} setTab={setTab} />
          )}
        </div>
      ) : (
        <Admin setting={setting} setSetting={setSetting} />
      )}
      <Analytics />
      <SpeedInsights />
    </Router>
  );
}

export default App;
