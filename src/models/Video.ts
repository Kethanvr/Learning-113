import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIMENSION = {
  height: 1080,
  width: 1920,
} as const;

export interface Ivideo {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  videourl: string;
  title: string;
  description: string;
  thumbnailurl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const videoSchema = new Schema<Ivideo>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    videourl: { type: String, required: true },
    thumbnailurl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSION.height },
      width: { type: Number, default: VIDEO_DIMENSION.width },
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  {
    timestamps: true,
  }
);

const Video = models?.Video || model<Ivideo>("Video", videoSchema);

export default Video;
