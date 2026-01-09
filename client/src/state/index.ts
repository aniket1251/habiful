import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  location: string;
  beds:string;
  baths:string;
  propertyType:string;
  amenities:string[];
  availableFrom:string;
  priceRange: [number,number] | [null, null];
  squareFeet: [number,number] | [null, null];
  coordinates?: [number,number];
}

 export const initialFilters: FiltersState = {
    location: "Bengaluru",
    beds:"any",
    baths:"any",
    propertyType:"any",
    amenities:[],
    availableFrom:"any",
    priceRange:[null, null],
    squareFeet:[null, null],
    coordinates: [77.59,12.97],
 }


interface InitialStateTypes{
  filters: FiltersState;
  isFiltersFullOpen:boolean;
  viewMode: "grid" | "list";
}

export const initialState: InitialStateTypes = {
  filters:initialFilters,
  isFiltersFullOpen: false,
  viewMode:"grid",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>)=>{
      state.filters = {...state.filters, ...action.payload};
    },
    toggleFiltersFullOpen: (state)=>{
      state.isFiltersFullOpen = !state.isFiltersFullOpen;
    },
    setViewMode: (state, action: PayloadAction<"grid" | "list" >) => {
      state.viewMode = action.payload;
    },
  },
});

export const {setFilters, toggleFiltersFullOpen, setViewMode} = globalSlice.actions;

export default globalSlice.reducer;
