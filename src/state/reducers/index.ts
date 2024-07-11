import { combineReducers } from "redux";

import pokemonsReducer from "./pokemons.reducers";

const reducers = combineReducers({ pokemons: pokemonsReducer })

export default reducers