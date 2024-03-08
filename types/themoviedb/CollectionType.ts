import { ImageType } from './abstract/ImageType';

export interface CollectionType extends ImageType {
	id: number;
	name: string;
}
