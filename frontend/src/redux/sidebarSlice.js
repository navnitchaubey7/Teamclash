// src/redux/sidebarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    isVisible: false,
    createRoom: false,
    enterRoom: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isVisible = !state.isVisible;
    },
    showCreatRoom: (state) => {
      state.createRoom = !state.createRoom;
      state.enterRoom = false;
    },
    hideSidebar: (state) => {
      state.isVisible = false;
    },
    showEnterRoom: (state) => {
      state.enterRoom = !state.enterRoom;
      state.createRoom = false;
    }
  },
});

export const { toggleSidebar, showCreatRoom, hideSidebar, showEnterRoom } = sidebarSlice.actions;
export default sidebarSlice.reducer;
