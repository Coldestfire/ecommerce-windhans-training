/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    _id: string;
    email: string;
    name: string;
    role: string;
  }
  
  interface UserState {
    user: User | null;
  }
  
  export const UserSlice = createSlice({
      name:'UserSlice',
      initialState:{
          user: null
      },
      reducers:{
          setUser(state: UserState, action: PayloadAction<User>){
              state.user = action.payload
          },
          removeUser(state: UserState) {
              state.user = null
          }
      }
  })


export const { removeUser,setUser} = UserSlice.actions;


export const UserSlicePath = (state: any) => state.UserSlice.user