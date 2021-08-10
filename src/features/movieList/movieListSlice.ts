import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Movie } from '../../classes/Movie.class';
import { movies$ } from '../../services/movies';

export interface MovieListState {
  list: Movie[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: MovieListState = {
  list: [],
  status: 'idle',
};

export const loadMoviesAsync = createAsyncThunk(
  'movieList/loadMovies',
  async () => {
    const response = await movies$;
    return response.map((movie : any) => new Movie(movie));
  }
);

export const movieListSlice = createSlice({
  name: 'movieList',
  initialState,
  reducers: {
    setMovies: (state, action) => {
      state.list = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMoviesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadMoviesAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list = action.payload;
      });
  },
});

export const { setMovies} = movieListSlice.actions;

export const selectList = (state: RootState) => state.movieList.list;


export default movieListSlice.reducer;
