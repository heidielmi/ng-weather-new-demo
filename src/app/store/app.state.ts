import { Injectable } from '@angular/core';
import { State, StateContext, Selector, Action } from '@ngxs/store';
import { ICity } from '../models/location.model';
import { AddCity, RemoveCity } from './city.actions';

export class AppStateModel {
  cityList!: ICity[];
  }
  
  
  @State<AppStateModel>({
    name: 'app',
    defaults: {
      cityList: []
    }
  })
  @Injectable()
  export class AppState {

    constructor( ) { }

    @Selector()
    static getCities(state: AppStateModel) {
      return state.cityList;
    }
  

    @Action(AddCity)
    addLocation(
      { getState, patchState }: StateContext<AppStateModel>,
      { city }: AddCity
    ) {
        const state = getState();
        patchState({ cityList: [...state.cityList, city] });
    }
    
    @Action(RemoveCity)
    removeLocation(
      { getState, patchState }: StateContext<AppStateModel>,
      { city }: RemoveCity
    ) {
        const state = getState();
        const filteredLocation = state.cityList.filter((existingCity) => existingCity.countryCode !== city.countryCode && existingCity.zipCode !== city.zipCode);
        patchState({ cityList: [...filteredLocation] });
    }
  
  }