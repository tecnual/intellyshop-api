import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document, Schema as Sch } from 'mongoose';
import { List, ListItem, ListUser } from '../list.schema';

export type SavedListDocument = SavedList & Document;

@Schema()
export class Totals {
  @Prop()
  cartQuantityTotal: number;
  @Prop()
  cartTotal: number;
  @Prop()
  listQuantityTotal: number;
  @Prop()
  listTotal: number;
  @Prop()
  total: number;
}

@Schema({
  timestamps: { createdAt: true, updatedAt: true }
})

export class SavedList extends List {
  @Prop({ type: Sch.Types.ObjectId, ref: 'Store'})
  listId;

  @Prop({type: Totals})
  totals?;
}

export const SavedListSchema = SchemaFactory.createForClass(SavedList);
export const SavedListSchemaProvider = {
  name: SavedList.name,
  useFactory: () => {
    SavedListSchema.pre('find', preQuery);
    return SavedListSchema;
  }
 };

 const preQuery = function() {
  const query = this.getQuery();
  const ownerId = query['owner._id'];
  delete query['owner._id'];
  query['$or'] = [{'owner._id': ownerId} , { 'sharedUsers._id': ownerId}]
  this.setQuery(query);
}
