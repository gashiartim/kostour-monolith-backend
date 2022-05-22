import { Media } from '../entities/media.entity';

export interface MediaMorphI {
  media?: Media;
  entity: string;
  entity_id: string;
  related_field: string;
  order?: number;
}
