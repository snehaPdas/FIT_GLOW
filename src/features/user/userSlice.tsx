import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { registerUser, verifyOtp, GoogleLogins,loginUser} from "../../actions/userActio"; // Fixed typo in import statement
import { User } from "../../features/user/userTypes";

interface UserState {
  userInfo: User | null;
  loading: boolean;
  error: string | null;
  showIncomingVideoCall:any,
  videoCall:any,
  roomIdUser:any
  showVideoCallUser:any
  
}

const initialState: UserState = {
  userInfo: null,
  loading: false,
  error: null,
  showIncomingVideoCall:{
    _id: "",
    callType: "",
    trainerName: "",
    trainerImage: '',
    roomId: null,
  },
  videoCall:null,
  roomIdUser:null,
  showVideoCallUser: false,
 

 



};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    
    setUser: (state, action: PayloadAction<User | null>) => {
      state.userInfo = action.payload;
    },
    setShowIncomingVideoCall: (state, action) => {
      state.showIncomingVideoCall = action.payload
        console.log('userslcie show incoming video*********************', state.showIncomingVideoCall);

      
    },
    setVideoCallUser(state, action: PayloadAction<string | null>) {
      state.videoCall = action.payload;
      console.log("///////videocalluser   /////////***********",state.videoCall)
    },
    setRoomIdUser(state, action: PayloadAction<string | null>) {  
      state.roomIdUser = action.payload;
    },
    setShowVideoCallUser(state, action: PayloadAction<boolean>) {
      state.showVideoCallUser = action.payload;
    },
    endCallUser: (state) => {
      console.log('hit  user sclice-------->');
      
      state.videoCall = null;
      state.showIncomingVideoCall = null;
      state.showVideoCallUser = false; // Ensure the video call state is false
      state.roomIdUser = null;         // Clear the room ID if necessary
      console.log('callend user slice',state.showIncomingVideoCall);
      localStorage.removeItem("IncomingVideoCall");
    },
   

  },
  extraReducers: (builder) => {
    console.log(".........................",)
    builder
      // Register User Actions
      .addCase(registerUser.fulfilled, (state, action) => {
        
        state.userInfo = action.payload; 
        state.loading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true; 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string; 
      })
       .addCase(loginUser.fulfilled,(state,action)=>{
        
        state.userInfo=action.payload.data.user
        console.log("user information got.........",state.userInfo)
        state.loading = false;
       })
       .addCase(loginUser.pending,(state)=>{
        state.loading = true; 

       })
       .addCase(loginUser.rejected,(state,action)=>{
        state.loading = false
        state.error = action.payload as string;
       })
      
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.userInfo = action.payload; 
        state.loading = false;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true; 
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false; 
        state.error = action.payload as string; 
      })
      .addCase(GoogleLogins.pending, (state) => {
        state.loading = true;
      })
      .addCase(GoogleLogins.fulfilled, (state, action:PayloadAction<User |null>) => {
        state.userInfo = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(GoogleLogins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
  
  },
});

export const { setUser, setShowIncomingVideoCall,setShowVideoCallUser,endCallUser,setRoomIdUser,setVideoCallUser} = userSlice.actions;

export default userSlice.reducer;
