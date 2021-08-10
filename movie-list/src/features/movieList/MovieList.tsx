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
  const list = useAppSelector(selectList);
  const dispatch = useAppDispatch();
  const [stateMovieList, setStateMovieList] = useState<Movie[]>([]);

  const [filteredMovieList, setFilteredMovieList] = useState<Movie[]>([]);

  const [filters, setFilters] = useState<string[]>([]);

  const [choiceFilters, setChoiceFilters] = useState<string[]>([]);

  const [page, setPage] = useState<number>(1);

  const [pagination, setPagination] = useState<number>(4);

  useEffect(() => {
    dispatch(loadMoviesAsync());
  }, [dispatch])

  useEffect(() => {
    setStateMovieList([...list]);
  }, [list])

  useEffect(() => {
    let tmpChoiceFilters: string[] = [];
    stateMovieList.forEach(movie => {
      if (!tmpChoiceFilters.includes(movie.category)) {
        tmpChoiceFilters.push(movie.category)
      }
    });
    setChoiceFilters(tmpChoiceFilters);
  }, [stateMovieList]);


  useEffect(() => {
    let tmpFilters = [...filters]
    tmpFilters.forEach((element, index) => {
      if (!choiceFilters.includes(element)) {
        tmpFilters.splice(index, 1)
      }
    });
    setFilters([...tmpFilters])
  }, [choiceFilters, filters]);

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

  useEffect(() => {
    setPage(1);
  }, [pagination, filters, filteredMovieList]);

  function changeFilter(event: React.ChangeEvent<HTMLSelectElement>) {
    let tmpFilters = [...filters];
    if (tmpFilters.includes(event.target.value)) {
      tmpFilters.splice(tmpFilters.indexOf(event.target.value), 1)
    } else {
      tmpFilters.push(event.target.value);
    }
    setFilters([...tmpFilters])
  }

  function onDeleteMovie(index: number) {

    let tmpFilteredMovieList = [...filteredMovieList];
    let tmpMovie = tmpFilteredMovieList[index];
    tmpFilteredMovieList.splice(index, 1);
    setFilteredMovieList([...tmpFilteredMovieList]);

    let tmpStateMovieList = [...stateMovieList];

    tmpStateMovieList.forEach((element, index) => {
      if (element.id === tmpMovie.id) {
        tmpStateMovieList.splice(index, 1)
      }
    });
    setStateMovieList([...tmpStateMovieList]);
  }

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
          <div style={{marginBottom : 10}}>
            <button onClick={() => setPage(page-1)} disabled={page === 1}>Previous</button>
            <span style={{ marginLeft : 10, marginRight : 10}}>{page}</span>
            <button onClick={() => setPage(page+1)} disabled={page === Math.ceil(filteredMovieList.length / pagination)}>Next</button>
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
