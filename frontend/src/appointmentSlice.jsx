import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments(state, action) {
      state.list = action.payload;
    },
    clearAppointments(state) {
      state.list = [];
    },
  },
});

export const { setAppointments, clearAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;
