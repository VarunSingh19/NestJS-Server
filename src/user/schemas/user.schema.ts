import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Roles } from "../user.types";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User{
    @Prop({required:true})
    fname:string;

    @Prop({required:true})
    lname:string;

    @Prop({required:true,unique:true})
    email:string;

    @Prop({default:Roles.Student,required:true})
    password:string;

}
export const UserSchema = SchemaFactory.createForClass(User);