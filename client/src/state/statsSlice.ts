// TODO header

// import redux toolkit
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// import default state
import defaultState from "./defaultState";

const stats = defaultState.stats;

const statsSlice = createSlice({

    name: "stats",
    initialState: stats,
    reducers: {

        // safe to mutate state thanks to redux toolkit

        // Open

        setStatsOpen: (state, { payload: open }: PayloadAction<typeof stats.open>) => {

            state.open = open;
        },

        toggleStatsOpen: (state) => {

            state.open = !state.open;
        },

        // FPS

        setFpsPollingRate: (state, { payload: pollingRate }: PayloadAction<typeof stats.fps.pollingRate>) => {

            state.fps.pollingRate = pollingRate;
        },

        setFps: (state, { payload: fps }: PayloadAction<typeof stats.fps.current>) => {

            state.fps.current = fps;
        }
    }
});

export const {

    setStatsOpen,
    toggleStatsOpen,
    setFpsPollingRate,
    setFps

} = statsSlice.actions;

export default statsSlice.reducer;