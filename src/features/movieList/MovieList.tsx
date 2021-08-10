import React, { useEffect, useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  loadMoviesAsync,
  selectList,
} from './movieListSlice';
import styles from './MovieList.module.css';
import { Movie } from '../../classes/Movie.class';
import { MovieComponent } from './Movie';

export function MovieList() {

  /**
   * The list of movies gathered asynchronously from the store
   */
  const list = useAppSelector(selectList);

  const dispatch = useAppDispatch();

  //The copy of the store list that we will be able to modify
  const [stateMovieList, setStateMovieList] = useState<Movie[]>([]);

  //The filtered list
  const [filteredMovieList, setFilteredMovieList] = useState<Movie[]>([]);

  //The filters chosen by the user
  const [filters, setFilters] = useState<string[]>([]);

  //All the choices possible
  const [choiceFilters, setChoiceFilters] = useState<string[]>([]);

  //The current page
  const [page, setPage] = useState<number>(1);

  //The number of elements per page
  const [pagination, setPagination] = useState<number>(4);

  //At the mount of the component, we fetch the movies asynchronously
  useEffect(() => {
    dispatch(loadMoviesAsync());
  }, [dispatch])

  //We copy the list to the state
  useEffect(() => {
    setStateMovieList([...list]);
  }, [list])

  /**
   * Two uses : 
   * - Initate the filter choices at the beginning
   * - Update the filters when we delete a movie
  */
  useEffect(() => {
    let tmpChoiceFilters: string[] = [];
    stateMovieList.forEach(movie => {
      //For every movie, we check if the category is already in the filters
      //If not, we add it
      if (!tmpChoiceFilters.includes(movie.category)) {
        tmpChoiceFilters.push(movie.category)
      }
    });
    setChoiceFilters(tmpChoiceFilters);
  }, [stateMovieList]);


  /**
   * When the list of filter choices get updated, we have to check
   * if there are some current filters that aren't in the list
   * of choices anymore
   */
  useEffect(() => {
    let tmpFilters = [...filters]
    tmpFilters.forEach((element, index) => {
      //For each current filter, we check if it is in the list of choices
      if (!choiceFilters.includes(element)) {
        tmpFilters.splice(index, 1)
      }
    });
    setFilters([...tmpFilters])
  }, [choiceFilters, filters]);

  /**
   * When the user make a choice on the filters
   * We update the filtered list
   */
  useEffect(() => {
    if (filters.length > 0) {
      let tmpFilteredMovieList: Movie[] = [];
      stateMovieList.forEach(element => {
        if (filters.includes(element.category)) {
          tmpFilteredMovieList.push(element);
        }
      });
      setFilteredMovieList([...tmpFilteredMovieList]);
    } else {
      setFilteredMovieList([...stateMovieList]);
    }

  }, [filters, stateMovieList]);

  /**
   * Resets the current page when a change is mage
   */
  useEffect(() => {
    setPage(1);
  }, [pagination, filters, filteredMovieList]);

  /**
   * Callback called when the user chooses a filter
   * Add the filter or remove it from the array of filters
   * @param event The user event
   */
  function changeFilter(event: React.ChangeEvent<HTMLSelectElement>) {
    let tmpFilters = [...filters];
    //If the user's choice is already in the filters, we remove it
    //Else we add it
    if (tmpFilters.includes(event.target.value)) {
      tmpFilters.splice(tmpFilters.indexOf(event.target.value), 1)
    } else {
      tmpFilters.push(event.target.value);
    }
    setFilters([...tmpFilters])
  }

  /**
   * The callback called when the user wants to delete a movie
   * @param index The index of the movie in the filtered list
   */
  function onDeleteMovie(index: number) {

    //Copy the filtered list from the state
    let tmpFilteredMovieList = [...filteredMovieList];
    //Copy the movie from the state
    let tmpMovie = tmpFilteredMovieList[index];
    //We remove the movie from the filteredList
    tmpFilteredMovieList.splice(index, 1);
    //Apply
    setFilteredMovieList([...tmpFilteredMovieList]);

    //Then we have to delete the movie from the initial list also
    let tmpStateMovieList = [...stateMovieList];

    //For each movie, we search the corresponding id and delete the element
    tmpStateMovieList.forEach((element, index) => {
      if (element.id === tmpMovie.id) {
        tmpStateMovieList.splice(index, 1)
      }
    });
    //Apply
    setStateMovieList([...tmpStateMovieList]);
  }

  //A callback made to reset the filters since we can't remove the last filter
  // By clicking on it
  function resetFilters() {
    setFilters([]);
  }

  return (
    <div>
      {
        choiceFilters.length > 0 &&
        <div className={styles.filtersContainer}>
          <select style={{ marginBottom: 5 }} multiple value={filters} onChange={(e) => changeFilter(e)}>
            {
              choiceFilters.map((aFilter) =>
                <option value={aFilter}>{aFilter}</option>
              )
            }
          </select>
          <button onClick={() => resetFilters()}>Reset filters</button>
        </div>
      }
      <div className={styles.containerList}>
        {
          filteredMovieList.map((movie, index) => {
            let comp = null;
            if (index >= ((page - 1) * pagination) && index < (page * pagination)) {
              comp = <MovieComponent movie={movie} index={index} key={`movie-${index}-${movie.id}`} deleteMovie={onDeleteMovie} />
            }
            return comp;
          }
          )
        }
      </div>
      <div>
        {
          Math.ceil(filteredMovieList.length / pagination) > 1 &&
          <div style={{ marginBottom: 10 }}>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
            <span style={{ marginLeft: 10, marginRight: 10 }}>{page}</span>
            <button onClick={() => setPage(page + 1)} disabled={page === Math.ceil(filteredMovieList.length / pagination)}>Next</button>
          </div>
        }

        <label>Number of results per page : </label>
        <select value={pagination} onChange={(e) => setPagination(+e.target.value)}>
          <option value={4}>4</option>
          <option value={8}>8</option>
          <option value={12}>12</option>
        </select>
      </div>
    </div>
  );
}
