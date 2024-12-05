import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {User} from "../../auth/schemas/user.schema";
import * as mongoose from "mongoose";


@Schema({
    timestamps: true,
})

export class Jog {
    @Prop()
    time: number;

    @Prop()
    distance: number;

    @Prop({default: Date.now})
    date: Date;

    @Prop({type: Object})
    location: {
        lat: number;
        lon: number;
    }

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: User;
}

export const JogSchema = SchemaFactory.createForClass(Jog);

export type WeeklyReport = {
    from: Date;
    to: Date;
    totalDistance: number;
    totalTime: number;
    avgSpeed: number;
    avgTime: number;
}
