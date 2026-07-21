import { createSlice } from "@reduxjs/toolkit";
import { deleteGalleryImages, fetchGallery, uploadGalleryImage } from "./galleryAsyncThunk";
import { STATUS } from "@/V2/config";

const initialState = {
    images: [],
    totalElements: 0,
    totalPages: 1,
    status: STATUS.IDLE,
    error: {
        fetch: "",
        delete: "",
    }
}

const gallerySlice = createSlice({
    name: "gallery",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGallery.pending, (state) => {
                state.status = STATUS.LOADING;
            })
            .addCase(fetchGallery.fulfilled, (state, action) => {
                state.status = STATUS.SUCCEEDED;
                state.images = action.payload.content;
                state.totalElements = action.payload.totalElements;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchGallery.rejected, (state, action) => {
                state.status = STATUS.FAILED;
                state.error.fetch = action.payload;
            })
            .addCase(deleteGalleryImages.pending, (state) => {
                state.status = STATUS.LOADING;
            })
            .addCase(deleteGalleryImages.fulfilled, (state, action) => {
                state.status = STATUS.SUCCEEDED;
                const deletedImg = action.payload;
                state.images = [...state.images.filter(img => !deletedImg.includes(img.imageUrl))]
            })
            .addCase(deleteGalleryImages.rejected, (state, action) => {
                state.status = STATUS.FAILED;
                state.error.delete = action.payload;
            })
            .addCase(uploadGalleryImage.pending, (state) => {
                state.status = STATUS.LOADING;
            })
            .addCase(uploadGalleryImage.fulfilled, (state, action) => {
                state.status = STATUS.SUCCEEDED;
                state.images.unshift(action.payload)
            })
            .addCase(uploadGalleryImage.rejected, (state, action) => {
                state.status = STATUS.FAILED;
                state.error.delete = action.payload;
            })
            
    },
});

export default gallerySlice.reducer;
export const galleryAction = gallerySlice.actions;