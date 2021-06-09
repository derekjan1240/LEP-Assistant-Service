import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MissionTeacherDocument = MissionTeacher & Document;

@Schema({ timestamps: true })
export class MissionTeacher {
  _id: any;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  owner: string;

  @Prop({ required: false, default: '' })
  exercise: string;

  @Prop({ required: false, default: '' })
  unit: string;

  @Prop({
    required: true,
    enum: ['Video', 'Exercise'],
    default: 'Video',
  })
  type: string;

  toJson() {
    return {
      _id: this._id,
      type: this.type,
      name: this.name,
      owner: this.owner,
      exercise: this.exercise,
      unit: this.unit,
    };
  }
}

export const MissionTeacherSchema = SchemaFactory.createForClass(
  MissionTeacher,
);

MissionTeacherSchema.loadClass(MissionTeacher);
