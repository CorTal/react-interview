import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import movieListReducer from '../features/movieList/movieListSlice';

export const store = configureStore({
  reducer: {
    movieList: movieListReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
