
export interface Film {
    id?: string | null;
    name?: string | null;
    imgUrl?: string | null;
    synopsis?: string | null;
    date?: string | null;
    minutes?: number | null;
    originalLanguage?: string | null;
    translateType?: string | null;
    translatedLanguage?: string | null;
    director?: string | null;
    genres?: Array<string> | null;
    actors?: Array<string> | null;
}