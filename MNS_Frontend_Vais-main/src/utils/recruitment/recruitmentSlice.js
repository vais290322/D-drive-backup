import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    candidates: [],
    loading: false,
    error: null
};

const recruitmentSlice = createSlice({
    name: 'recruitment',
    initialState,
    reducers: {
        setCandidates: (state, action) => {
            state.candidates = action.payload;
        },
        addCandidate: (state, action) => {
            state.candidates.push(action.payload);
            state.loading = false;
        },
        updateCandidate: (state, action) => {
            const updatedCandidate = action.payload;
            const index = state.candidates.findIndex(candidate => candidate.id === updatedCandidate.id);
            
            if (index !== -1) {
                state.candidates[index] = updatedCandidate;
            }
            state.loading = false;
        },
        onboardCandidate: (state, action) => {
            const candidateId = action.payload;
            const index = state.candidates.findIndex(candidate => candidate.id === candidateId);
            
            if (index !== -1) {
                state.candidates[index].onboarded = true;
            }
            state.loading = false;
        },
        setLoading: (state) => {
            state.loading = true;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        }
    }
});

export const { setCandidates, addCandidate, updateCandidate, onboardCandidate, setLoading, setError, clearError } = recruitmentSlice.actions;
export default recruitmentSlice.reducer;
