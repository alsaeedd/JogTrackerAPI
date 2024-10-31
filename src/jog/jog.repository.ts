import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Jog, WeeklyReport } from "./schemas/jog.schema";
import mongoose from "mongoose";

@Injectable()
export class JogRepository {
    constructor(
        @InjectModel(Jog.name)
        private jogModel: mongoose.Model<Jog>
    ) {}

    async generateWeeklyReport(from: Date, to: Date, user: string): Promise<WeeklyReport> {
        const result = await this.jogModel.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(user),
                date: {
                    $gte: from,
                    $lte: to
                }
            }

        },
        {
            $group: {
                _id: null,
                totalDistance: { $sum: "$distance" },
                totalTime: { $sum: "$time" },
                avgTime: { $avg: "$time" },
                avgSpeed: { 
                    $avg: { 
                        $divide: ['$distance', { $divide: ['$time', 3600] }] 
                      } 
                }

            }
        },
        {
            $project: {
                _id: 0,
                totalDistance: 1,
                totalTime: 1,
                avgTime: 1,
                avgSpeed: 1
            }
        }
    ]);
    const report : WeeklyReport = {
        from,
        to,
        totalDistance: 0,
        totalTime: 0,
        avgSpeed: 0,
        avgTime: 0
      };

      return report;
    }
}