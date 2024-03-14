import { ImageType } from './abstract/ImageType';
import { GenreType } from './GenreType';
import { CollectionType } from './CollectionType';
import { ProductionCompanyType } from './ProductionCompanyType';
import { ProductionCountryType } from './ProductionCountryType';
import { LanguageType } from './LanguageType';

interface MovieAbstractType extends ImageType {
	id: number;
	adult: boolean;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	release_date: Date;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

export interface MovieDiscoverType extends MovieAbstractType {
	genre_ids: number[];
}

export interface MovieDetailsType extends MovieAbstractType {
	belongs_to_collection: CollectionType;
	budget: number;
	genres: GenreType[];
	homepage: string;
	imdb_id: string;
	production_companies: ProductionCompanyType[];
	production_countries: ProductionCountryType[];
	revenue: number;
	runtime: number;
	spoken_languages: LanguageType[];
	status: string;
	tagline: string;
}
