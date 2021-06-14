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

  @Prop({ type: String, required: true })
  classroom: string;

  @Prop({ type: Object, required: false })
  answer: any;

  @Prop({ type: Object, required: false })
  review: any;

  @Prop({ type: Boolean, required: false, default: false })
  is_complated: boolean;

  @Prop({ type: Date, required: false, default: null })
  complated_date: Date;

  @Prop({ type: Boolean, required: false, default: false })
  is_reviewed: boolean;

  @Prop({ type: Date, required: false, default: null })
  reviewed_date: Date;

  toJson() {
    return {
      _id: this._id,
      // mission: this.mission,
      assigner: this.assigner,
      assignee: this.assignee,
      classroom: this.classroom,
      answer: this.answer,
      review: this.review,
      is_complated: this.is_complated,
      complated_date: this.complated_date,
      is_reviewed: this.is_reviewed,
      reviewed_date: this.reviewed_date,
    };
  }
}

export const MissionSchema = SchemaFactory.createForClass(Mission);

MissionSchema.loadClass(Mission);
