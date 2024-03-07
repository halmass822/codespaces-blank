import { createSlice, configureStore, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getWeather = createAsyncThunk(
    "weather/getWeather",
    ({stations, type}) => getWeatherData(stations, type)
)

const weather = createSlice({
    name: "weather",
    initialState: {
        station: "",
        type: "",
        weather: {},
        isLoadingWeather: false,
        failedToLoadWeather: false
    },
    reducers: {
        setStation: (state, action) => { //set target weather station
            return state.station = action.payload
        },
        setType: (state, action) => { //set requested data type (METAR, TAF)
            return state.type = action.payload
        }
    },
    extraReducers: {
        [getWeather.pending]: (state, action) => {
            state.isLoadingWeather = true;
            state.failedToLoadWeather = false;
        },
        [getWeather.fulfilled]: (state, action) => {
            state.isLoadingWeather = false;
            state.failedToLoadWeather = false;
            state.weather = action.paylod;
        },
        [getWeather.rejected]: (state, action) => {
            state.isLoadingWeather = false;
            state,failedToLoadWeather = true;
        }
    }
})

export const weatherSelector = (state) => state.weather.weather;
export const stationSelector = (state) => state.weather.stations;
export const typeSelector = (state) => state.weather.type;
export const {setStation, setType} = weather.actions;


export function getWeatherData(targets, type) {
    if(targets.length < 1 || type !== "metar" || type !== "taf") {
        console.error("getWeatherData() invalid parameters")
        return null;
    } else {
        return axios.get(`https://aviationweather.gov/api/data/${type}/?ids=${targets.map((x) => x + ",")}&format=json`)
        .then((res) => console.log(res.data))
    }
}

export default configureStore({
    reducer: {
        "weather": weather
    }
});