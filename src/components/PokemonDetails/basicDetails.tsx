import axios from "axios";
import React, { useState, useEffect } from "react";

// Import hooks provided by react-redux
import { useSelector, useDispatch } from "react-redux";

// Import all actions and bind them

// Import Loader
import Loader from "../Loader/loader";

// Import React-Bootstrap Components
import { Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";

// Import CSS
import styles from "./BasicDetailsStyles.module.css";

// Add routing
import { useRouter } from "next/router";
import { getPokemonsData } from "@/src/state/actions/pokemons.actions";

const BasicDetails: React.FC = () => {
    const router = useRouter();

    const pokemonsData = useSelector((state: any) => state?.pokemons?.pokemonsData);
    const dispatch = useDispatch();

    const fetchpokemons = async () => {
        const endpoint = "https://beta.pokeapi.co/graphql/v1beta"
        const headers = {
            "content-type": "application/json"
        }
        const graphqlQuery = {
            "query": 'query samplePokeAPIquery {pokemon_v2_generation {id,pokemon_v2_generationnames(where: {pokemon_v2_language: {name: {_eq: "es"}}}) {name,pokemon_v2_language {name}}pokemon_v2_pokemonspecies {id,pokemon_v2_evolutionchain {id, pokemon_v2_pokemonspecies {id, name}}pokemon_v2_pokemons {id,name,pokemon_v2_pokemontypes {pokemon_v2_type {name}}}}}}',
            "variables": {}
        }
        const response = await axios.post(endpoint, JSON.stringify(graphqlQuery), { headers }).then((res) => res.data.data.pokemon_v2_generation.reduce((acc: [{ name: string, generation: string, id: number, types: string, chain: string }], key: any) => {
            const generationName = key.pokemon_v2_generationnames[0].name
            key.pokemon_v2_pokemonspecies.forEach((pokemon_species: any) => {
                const chain = pokemon_species.pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies.map((x: any) => x.name).join(',')
                pokemon_species.pokemon_v2_pokemons.forEach((pokemon: any) => {
                    acc.push({ id: pokemon.id, name: pokemon.name, generation: generationName, types: pokemon.pokemon_v2_pokemontypes.map((x: any) => x.pokemon_v2_type.name).join(', '), chain })
                })
            })
            return acc
        }, []))
        dispatch(getPokemonsData(response))
    }



    useEffect(() => {
        fetchpokemons()
    }, [])

    const [generation, setGeneration] = useState('')
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [id, setId] = useState('')

    const modifyGeneration = (value: string) => {
        setGeneration(value)
    }
    const modifyName = (value: string) => {
        setName(value)
    }
    const modifyId = (value: string) => {
        setId(value)
    }
    const modifyType = (value: string) => {
        setType(value)
    }

    const filterPokemons = () => pokemonsData.filter((x: any) => {
        const checks = [true]
        if (generation) checks.push(x.generation.toLocaleLowerCase().includes(generation.toLocaleLowerCase()))
        if (name) checks.push(x.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()) || x.chain.toLocaleLowerCase().includes(name.toLocaleLowerCase()))
        
        if (type) checks.push(x.types.toLocaleLowerCase().includes(type.toLocaleLowerCase()))
        if (id) checks.push((""+x.id).toLocaleLowerCase().includes(id.toLocaleLowerCase()))
        return checks.every(x => x)
    })


    return (
        <>
            <h1 className={styles.mainHeader}>pokemons</h1>
            {
                (!pokemonsData && pokemonsData == undefined) ?
                    <>
                        <Loader />
                    </>
                    :
                    <>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th><Form.Control size="sm" type="text" value={id} placeholder="Id." onChange={e => modifyId(e.target.value)}></Form.Control></th>
                                    <th><Form.Control size="sm" type="text" value={name} placeholder="Nombre" onChange={e => modifyName(e.target.value)}></Form.Control></th>
                                    <th><Form.Control size="sm" type="text" value={generation} placeholder="Generación" onChange={e => modifyGeneration(e.target.value)}></Form.Control></th>
                                    <th><Form.Control size="sm" type="text" value={type} placeholder="Tipos" onChange={e => modifyType(e.target.value)}></Form.Control></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterPokemons().map((x: any, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td>{x.id}</td>
                                            <td>{x.name}</td>
                                            <td>{x.generation}</td>
                                            <td>{x.types}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </>
            }
            {/* < h5
                className={styles.newPlayerRoute}
                onClick={() => getMorePokemons()}
            >
                Cargar mas pokemons
            </h5 > */}


        </>
    )
}

export default BasicDetails;