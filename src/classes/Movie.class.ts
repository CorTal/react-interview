export class Movie {

	public id : string = '';

	public title : string = '';

	public category : string = '';

	public likes : number = 0;

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