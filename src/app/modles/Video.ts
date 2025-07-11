import { Bold } from "lucide-react";
import mongoose , {Schema, model, models} from "mongoose";
import { title } from "process";

export const VIDEO_DIMENSION = {
    height:1080,
    width:1920
} as const;

export interface Ivideo{
    _id:mongoose.Types.ObjectId,
    videourl:string,
    title:string,
    desciption:string,
    thumbnailurl:string,
    controls?:Boolean,
    transformation?: {
        height: number,
        width:number,
        quality?:number
        }
}

const videoSchema = new Schema<Ivideo>(
    {
        title: {type:String, required:true},
        desciption:{type:String,required:true},
        videourl:{type:String,required:true},
        thumbnailurl:{type:String,required:true},
        controls:{type:Boolean, default:true},
        transformation:{
            height:{type:Number,default:VIDEO_DIMENSION.height},
            width:{type:Number,default:VIDEO_DIMENSION.width},
            quality:{type:Number, min:1 ,max:100 }
        },
    }
    ,{
        timestamps:true
    }
)

const Video = models?.Videoschema || model<Ivideo>("Videoschema",videoSchema )

export default Video;