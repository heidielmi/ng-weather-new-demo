export interface ICity {
    zipCode: string;
    cityName?: string;
    countryCode: string;
}
export interface ICountry {
    countryCode: string;
    countryName: string;
    cities?: ICity[]
}
