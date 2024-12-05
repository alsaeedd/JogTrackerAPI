import {IsDate, IsEmpty, IsNotEmpty, IsNumber, IsObject} from "class-validator";
import {Type} from "class-transformer";
import {User} from "../../auth/schemas/user.schema";

class Location{
    @IsNotEmpty()
    @IsNumber()
    lat: number;

    @IsNotEmpty()
    @IsNumber()
    lon: number;
}

export class CreateJogDto{
    @IsNotEmpty()
    @IsNumber()
    readonly time: number;

    @IsNotEmpty()
    @IsNumber()
    readonly distance: number;

    @IsNotEmpty()
    @IsDate()
    readonly date: Date;

    @IsNotEmpty()
    @IsObject()
    @Type(() => Location)
    readonly location: Location;

    @IsEmpty({message: 'User is not allowed to be set'})
    readonly user: User;
}
