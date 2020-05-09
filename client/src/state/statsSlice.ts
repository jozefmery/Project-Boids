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
        },

        // Entities

        setEntityPollingRate: (state, { payload: pollingRate }: PayloadAction<typeof stats.entities.pollingRate>) => {

            state.entities.pollingRate = pollingRate;
        },

        setSelectedEntity: (state, { payload: selected }: PayloadAction<typeof stats.entities.selected>) => {

            state.entities.selected = selected;
        },

        setPredatorCount: (state, { payload: count }: PayloadAction<typeof stats.entities.predatorCount>) => {

            state.entities.predatorCount = count;
        },

        setPreyCount: (state, { payload: count }: PayloadAction<typeof stats.entities.preyCount>) => {

            state.entities.preyCount = count;
        },
    }
});

export const {

    setStatsOpen,
    toggleStatsOpen,
    setFpsPollingRate,
    setFps,
    setEntityPollingRate,
    setSelectedEntity,
    setPredatorCount,
    setPreyCount

} = statsSlice.actions;

export default statsSlice.reducer;