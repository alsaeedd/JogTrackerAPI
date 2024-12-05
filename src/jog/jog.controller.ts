import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {JogService} from "./jog.service";
import {Jog} from "./schemas/jog.schema";
import {CreateJogDto} from "./dto/create-jog.dto";
import {UpdateJogDto} from "./dto/update-jog.dto";
import {Query as ExpressQuery} from 'express-serve-static-core';
import {AuthGuard} from "@nestjs/passport";
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('jogs')
export class JogController {
    constructor(private jogService: JogService) {}

    @Get()
    @Roles(Role.Manager, Role.Admin)
    @UseGuards(AuthGuard(), RolesGuard)
    async getAllJogs(@Query() query: ExpressQuery): Promise<Jog[]> {
        return this.jogService.findAll(query);
    }

    @Post()
    @UseGuards(AuthGuard())
    async createJog(
        @Body()
        jog: CreateJogDto,
        @Req() req,
    ): Promise<Jog> {
        return this.jogService.create(jog, req.user);
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    async getJog(
        @Param('id')
        id: string,
        @Req() req,
    ): Promise<Jog> {
        return this.jogService.findById(id, req.user);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async updateJog(
        @Param('id')
            id: string,
        @Body()
            jog: UpdateJogDto
    ): Promise<Jog> {
        return this.jogService.updateById(id, jog);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async deleteJog(
        @Param('id')
            id: string
    ): Promise<Jog> {
        return this.jogService.deleteById(id);
    }
}
