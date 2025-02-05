import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  setRoomIdUser,
  setShowIncomingVideoCall,
  setShowVideoCallUser,
  setVideoCallUser,
} from "../../features/user/userSlice";
import {useSocketContext} from '../../context/socket'



function VideoCall() {
  const videoCallRef = useRef<HTMLDivElement | null>(null);
  const { roomIdUser, showIncomingVideoCall, videoCall  } = useSelector((state: RootState) => state.user);
  let {socket}  = useSocketContext()
  const dispatch = useDispatch();

  console.log('videoCall',showIncomingVideoCall);
  

  useEffect(() => {
    console.log("/////////")
    console.log("Room ID roomIdUser:", roomIdUser);
    if ( !roomIdUser) return;
    // Continue setup...
  }, [ roomIdUser]);

  useEffect(() => {
    if (!roomIdUser) return;

    const appId = parseInt(import.meta.env.VITE_APP_ID)
    const serverSecret = (import.meta.env.VITE_ZEGO_SECRET)

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomIdUser.toString(),
      Date.now().toString(),
      "User"
    );

 

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({      
      container: videoCallRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showPreJoinView: false,
      onLeaveRoom: () => {
        socket?.emit("leave-room", { to: showIncomingVideoCall?.trainerId});
        // alert('leave-room user')
        console.log('USER SOCKET ID', socket?.id);
        
        
        dispatch(setShowVideoCallUser(false));
        dispatch(setRoomIdUser(null));
        dispatch(setVideoCallUser(null));
        dispatch(setShowIncomingVideoCall(null))
        // localStorage.removeItem("roomId");
        // localStorage.removeItem("showVideoCall");
      },
    });

    socket?.on("user-left", () => {
      console.log('hit user left');
      alert('hit user left')
      zp.destroy();
      dispatch(setShowVideoCallUser(false));
      dispatch(setRoomIdUser(null));
      dispatch(setVideoCallUser(null));
      dispatch(setShowIncomingVideoCall(null))
      localStorage.removeItem("roomId");
      localStorage.removeItem("showVideoCall");
    });

    return () => {
      zp.destroy();
      socket?.off("user-left");
    };
  }, [roomIdUser,  dispatch]);

  

  return (
    <div
    className="w-screen bg-[#572c52] h-screen absolute z-[100]"
    ref={videoCallRef}
  />
  )
}

export default VideoCall;
