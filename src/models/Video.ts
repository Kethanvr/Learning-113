import mongoose from "mongoose";

export interface Ivideo extends mongoose.Document {
  title: string;
  desciption: string;
  videourl: string;
  thumbnailurl: string;
  userid?: string;
  username?: string;
  likes?: number;
  likedBy?: string[];
  comments?: Array<{
    id: string;
    text: string;
    username: string;
    userid: string;
    createdAt: Date;
  }>;
  views?: number;
  controls?: boolean;
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const VideoSchema = new mongoose.Schema<Ivideo>(
  {
    title: {
      type: String,
      required: true,
    },
    desciption: {
      type: String,
      required: true,
    },
    videourl: {
      type: String,
      required: true,
    },
    thumbnailurl: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      default: "",
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: String,
      },
    ],
    comments: [
      {
        id: String,
        text: String,
        username: String,
        userid: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    controls: {
      type: Boolean,
      default: true,
    },
    transformation: {
      width: Number,
      height: Number,
      crop: String,
    },
  },
  {
    timestamps: true,
  }
);

const Video =
  mongoose.models.Video || mongoose.model<Ivideo>("Video", VideoSchema);
export default Video;
