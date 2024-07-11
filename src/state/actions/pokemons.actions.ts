export const getPokemonsData = (pokemons: any) => {
    return {
        type: 'getPokemons',
        payload: { pokemons }
    }
}