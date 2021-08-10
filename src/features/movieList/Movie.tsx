import { useState } from 'react';
import { ReactComponent as ThumbUp } from '@material-design-icons/svg/filled/thumb_up.svg'
import { ReactComponent as ThumbDown } from '@material-design-icons/svg/filled/thumb_down.svg'
import { Movie } from '../../classes/Movie.class';

import styles from './Movie.module.css';

/**
 * The props of the component
 * movie : The Movie to display
 * index : The index of the Movie in the parent's list
 * deleteMovie : The callback to delete the movie at the indicated index
 */
interface MovieProps {
  movie : Movie,
  index : number,
  deleteMovie : (index : number) => void
}

/**
 * The component displaying a Movie as a card
 */
export function MovieComponent(props : MovieProps) {

  const { movie, index, deleteMovie } = props;

  // We copy the movie from props to state to be able to modify it
  const [stateMovie, setStateMovie] = useState<Movie>(movie);

  //Has the current user liked the movie ?
  const [liked, setLiked] = useState<boolean>(false);

  //Has the current user disliked the movie
  const [disliked, setDisliked] = useState<boolean>(false);

  //We calculate the ratio of likes / dislikes to correctly display the bar
  let totalLikes = stateMovie.likes + stateMovie.dislikes;
  let ratioLike = 0;
  if(totalLikes !== 0)
  {
    ratioLike = (stateMovie.likes/totalLikes)*100
  }

  //The like action from the user
  function like(){
    //Copy the movie as a mutable variable
    let tmpMovie = new Movie(stateMovie);
    //Do we have to add or substract
    let change = liked ? -1 : +1;
    tmpMovie.likes = tmpMovie.likes + change;

    //You can't like AND dislike at the same time, we check that
    if(!liked && disliked){
      tmpMovie.dislikes = tmpMovie.dislikes - 1;
      setDisliked(false);
    }
    //Apply changes
    setStateMovie(tmpMovie)
    setLiked(!liked);
    
  }

  //The dislike action fr
  function dislike(){
    //Copy the movie as a mutable variableom the user
    let tmpMovie = new Movie(stateMovie);
    //Do we have to add or substract
    let change = disliked ? -1 : +1;
    tmpMovie.dislikes = tmpMovie.dislikes + change;
    //You can't like AND dislike at the same time, we check that
    if(!disliked && liked){
      tmpMovie.likes = tmpMovie.likes - 1;
      setLiked(false);
    }
    //Apply changes
    setStateMovie(tmpMovie)
    setDisliked(!disliked);
  }

  return (
    <div className={styles.movieCard}>
      <div className={styles.headerCard}>
        {stateMovie.title}
      </div>
      <div className={styles.contentCard}>
        {stateMovie.category}
      </div>
      <div className={styles.likesCard}>
          <div className={styles.likeValues}>
            <ThumbUp fill={liked ? 'blue' : 'grey'} className={styles.thumbUpCard} onClick={() => like()}/>
            <span>{stateMovie.likes}</span>
          </div>
          <div className={styles.likeValues}>
            <span>{stateMovie.dislikes}</span>
            <ThumbDown fill={disliked ? 'blue' : 'grey'} className={styles.thumbDownCard}   onClick={() => dislike()}/>
          </div>
      </div>
        <div className={styles.dislikeBar}>
          <div className={styles.likeBar} style={{ width : `${ratioLike}%`}}/>
        </div>
      <button className={styles.button} onClick={() => deleteMovie(index)}>Delete</button>
    </div>
  );
}
