import { ICity } from "../models/location.model";

export class AddCity {
    static readonly type = '[WeatherApp] Add City';
    constructor(public city: ICity) {}
}
export class RemoveCity {
    static readonly type = '[WeatherApp] Remove City';
    constructor(public city: ICity) {}
}

export class GetAllCities {
    static readonly type = '[WeatherApp] Get All Cities';
}