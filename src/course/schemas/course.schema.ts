import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";


export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course{
    @Prop({required:true})
    name:string;

    @Prop({required:true})
    description:string;

    @Prop({required:true})
    level:string;

    @Prop({required:true})
    price:number;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
createdBy: string;

}
export const CourseSchema = SchemaFactory.createForClass(Course);