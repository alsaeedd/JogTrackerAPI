import { ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import {Jog, WeeklyReport} from "./schemas/jog.schema";
import {Query} from 'express-serve-static-core';
import { User } from 'src/auth/schemas/user.schema';
import { JogRepository } from './jog.repository';


@Injectable()
export class JogService {
    constructor(
        // private jogRepository: JogRepository,
        @InjectModel(Jog.name)
        private jogModel: mongoose.Model<Jog>
    ) {}

    async findAll(query: Query): Promise<Jog[]> {
        const resultsPerPage = 2;
        const currentPage = Number(query.page) || 1;
        const skip = resultsPerPage * (currentPage - 1);

        const jogs = await this.jogModel.find().limit(resultsPerPage).skip(skip);
        return jogs;
    }

    async create(jog: Jog, user: User): Promise<Jog> {
        
        const data = Object.assign(jog,{ user: user._id})

        const response = await this.jogModel.create(jog);

        return response;
    }

    async findById(id: string): Promise<Jog> {

        const jog = await this.jogModel.findById(id);

        // if(jog.user != user._id) {
        //     throw new ForbiddenException('Unauthorized.');
        // }

        if(!jog) {
            throw new NotFoundException('Jog not found.');
        }

        return jog;
    }

    async updateById(id: string, jog: Jog): Promise<Jog> {
        return await this.jogModel.findByIdAndUpdate(id, jog, {
            new: true,
            runValidators: true
        });
    }

    async deleteById(id: string): Promise<Jog> {
        return await this.jogModel.findByIdAndDelete(id);
    }

    // async generateWeeklyReport(from: Date, to: Date, user: string): Promise<WeeklyReport> {
    //     return await this.jogRepository.generateWeeklyReport(from, to, user);
    // }
}
