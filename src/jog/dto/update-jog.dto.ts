import {IsDate, IsEmpty, IsNumber, IsObject, IsOptional} from "class-validator";
import {Type} from "class-transformer";
import {User} from "../../auth/schemas/user.schema";

class Location{
    @IsOptional()
    @IsNumber()
    lat: number;

    @IsOptional()
    @IsNumber()
    lon: number;
}

export class UpdateJogDto{
    @IsOptional()
    @IsNumber()
    readonly userId: number;

    @IsOptional()
    @IsNumber()
    readonly time: number;

    @IsOptional()
    @IsNumber()
    readonly distance: number;

    @IsOptional()
    @IsDate()
    readonly date: Date;

    @IsOptional()
    @IsObject()
    @Type(() => Location)
    readonly location: Location;

    @IsEmpty({message: 'User is not allowed to be set'})
    readonly user: User;
}
