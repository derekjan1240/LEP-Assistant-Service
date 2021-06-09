import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type MissionDocument = Mission & Document;

@Schema({ timestamps: true })
export class Mission {
  _id: any;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'MissionTeacher',
    required: true,
  })
  mission: Types.ObjectId;

  @Prop({ type: String, required: true })
  assigner: string;

  @Prop({ type: String, required: true })
  assignee: string;

  @Prop({ type: Object, required: false })
  answer: any;

  @Prop({ type: Object, required: false })
  review: any;

  @Prop({ type: Boolean, required: false, default: false })
  is_complated: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  is_reviewed: boolean;

  // toJson() {
  //   return {
  //     _id: this._id,
  //     type: this.type,
  //     name: this.name,
  //     owner: this.owner,
  //     exercise: this.exercise,
  //     unit: this.unit,
  //   };
  // }
}

export const MissionSchema = SchemaFactory.createForClass(Mission);

MissionSchema.loadClass(Mission);
