export interface IBand {
  id: number;
  name: string;
  photo: string;
  formation_date: string;
  debut_date: string;
  genre: IGenre[];
  members: string;
  member_photos: string;
  member_info: string;
  hit_songs: string;
  music_photo: string;
  introduction: string;
  albums: string;
  awards: string;
}

interface IGenre {
  id: number;
  name: string;
}

export interface IComment {
  detail: string;
  date: string;
}
