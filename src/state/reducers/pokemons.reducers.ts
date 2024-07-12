const initialState: any = {
    pokemonsData: [],
    loading: true
}

const pokemonsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'getPokemons': {
            return {
                ...state,
                pokemonsData: [...state.pokemonsData, ...action.payload.pokemons].reduce((acc: any, key: any) => acc.map((x: any) => x.id).includes(key.id) ? acc : [...acc, key] ,[]).sort((a: any, b: any) => a.id - b.id),
                loading: false
            }
        }
        
        default:
            return state
    }
}

export default pokemonsReducer