import { useState } from 'react';
import { ReactComponent as ThumbUp } from '@material-design-icons/svg/filled/thumb_up.svg'
import { ReactComponent as ThumbDown } from '@material-design-icons/svg/filled/thumb_down.svg'
import { Movie } from '../../classes/Movie.class';

import styles from './Movie.module.css';

interface MovieProps {
  movie : Movie,
  index : number,
  deleteMovie : (index : number) => void
}

export function MovieComponent(props : MovieProps) {
  const { movie, index, deleteMovie } = props;

  const [stateMovie, setStateMovie] = useState<Movie>(movie);

  const [liked, setLiked] = useState<boolean>(false);

  const [disliked, setDisliked] = useState<boolean>(false);

  let totalLikes = stateMovie.likes + stateMovie.dislikes;
  let ratioLike = 0;
  if(totalLikes !== 0)
  {
    ratioLike = (stateMovie.likes/totalLikes)*100
  }

  function like(){
    let tmpMovie = new Movie(stateMovie);
    let change = liked ? -1 : +1;
    tmpMovie.likes = tmpMovie.likes + change;
    if(!liked && disliked){
      tmpMovie.dislikes = tmpMovie.dislikes - 1;
      setDisliked(false);
    }
    setStateMovie(tmpMovie)
    setLiked(!liked);
    
  }

  function dislike(){
    let tmpMovie = new Movie(stateMovie);
    let change = disliked ? -1 : +1;
    tmpMovie.dislikes = tmpMovie.dislikes + change;
    if(!disliked && liked){
      tmpMovie.likes = tmpMovie.likes - 1;
      setLiked(false);
    }
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
