//Class representing a Movie in this context
export class Movie {

	//The id of the Movie
	public id : string = '';

	//The name / title of the Movie
	public title : string = '';

	//The type of film
	public category : string = '';

	//The number of likes on the movie
	public likes : number = 0;

	//The number of dislikes on the movie
	public dislikes : number = 0;

	constructor(row? : any) {

		if (row) {

			const {
				id,
				title,
				category,
				likes,
				dislikes
			} = row;

			this.id = id;

			this.title = title;

			this.category = category;

			this.likes = likes;

			this.dislikes = dislikes;

		}
	}
}