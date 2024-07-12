import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import Carousel from 'react-material-ui-carousel'
import Loader from "../Loader/loader";
import { Table } from "react-bootstrap";
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import Form from "react-bootstrap/Form";
import Avatar from '@mui/material/Avatar';
import styles from "./BasicDetailsStyles.module.css";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from "next/router";
import { getPokemonsData } from "@/src/state/actions/pokemons.actions";
import { CardActions, CardContent, Collapse, createTheme, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, ThemeProvider, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { ExpandMore } from "@mui/icons-material";
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CardMedia from '@mui/material/CardMedia';

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: any;
    onClose: () => void;
}

const theme = createTheme()

theme.typography.fontSize = 14

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
        width: '650px',
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
        width: '650px',
    },
}));

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
            "query": `query samplePokeAPIquery {
  pokemon_v2_generation {
    id
    pokemon_v2_generationnames(where: {pokemon_v2_language: {name: {_eq: "es"}}}) {
      name
    }
    pokemon_v2_pokemonspecies {
      id
      pokemon_v2_pokemonspeciesnames(where: {pokemon_v2_language: {name: {_eq: "es"}}}) {
        name
      }
      pokemon_v2_evolutionchain {
        id
        pokemon_v2_pokemonspecies {
          id
          pokemon_v2_pokemonspeciesnames(where: {pokemon_v2_language: {name: {_eq: "es"}}}) {
            name
          }
          pokemon_v2_pokemons {
            pokemon_v2_pokemonsprites {
              sprites
            }
          }
        }
      }
      pokemon_v2_pokemons {
        id
        name
        pokemon_v2_pokemonstats {
          pokemon_v2_stat {
            pokemon_v2_statnames(where: {pokemon_v2_language: {name: {_eq: "es"}}}) {
              name
            }
          }
          base_stat
        }
        pokemon_v2_pokemonsprites {
          sprites
        }
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            pokemon_v2_typenames(where: {pokemon_v2_language: {name: {_eq: "es"}}}) {
              name
            }
          }
        }
      }
    }
  }
}
`,
            "variables": {}
        }
        const response = await axios.post(endpoint, JSON.stringify(graphqlQuery), { headers }).then((res) => res.data.data.pokemon_v2_generation.reduce((acc: [{ name: string, generation: string, principalImage: string, id: number, types: string[], evolutions: { id: number, name: string, image: string, principal: boolean }, stats: { stat: string, value: number }[] }], key: any) => {
            const generationName = key.pokemon_v2_generationnames[0].name
            key.pokemon_v2_pokemonspecies.forEach((pokemon_species: any, index: number) => {
                const evolutions = pokemon_species.pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies.map((x: any) => ({ id: x.id, name: x.pokemon_v2_pokemonspeciesnames[0].name, principal: x.id === pokemon_species.id, image: x.pokemon_v2_pokemons[0].pokemon_v2_pokemonsprites[0].sprites.front_default || "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png" })).sort((a: any, b: any) => a.id - b.id)
                pokemon_species.pokemon_v2_pokemons.forEach((pokemon: any) => {
                    acc.push({ stats: pokemon.pokemon_v2_pokemonstats.map((stat: any) => ({ stat: stat.pokemon_v2_stat.pokemon_v2_statnames[0].name, value: stat.base_stat })), principalImage: pokemon.pokemon_v2_pokemonsprites[0].sprites.front_default || "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png", id: pokemon.id, name: pokemon_species.pokemon_v2_pokemonspeciesnames[0].name, generation: generationName, types: pokemon.pokemon_v2_pokemontypes.map((x: any) => x.pokemon_v2_type.pokemon_v2_typenames[0].name), evolutions })
                })
            })
            return acc
        }, []))
        setStatus('loaded')
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

    const filterPokemons = () => {
        const data = pokemonsData.filter((x: any) => {
            const checks = [true]
            if (generation) checks.push(x.generation.toLocaleLowerCase().includes(generation.toLocaleLowerCase()))
            if (name) checks.push(x.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()) || x.evolutions.map((x: any) => x.name).join(', ').toLocaleLowerCase().includes(name.toLocaleLowerCase()))

            if (type) checks.push(x.types.toLocaleLowerCase().includes(type.toLocaleLowerCase()))
            if (id) checks.push(("" + x.id).toLocaleLowerCase().includes(id.toLocaleLowerCase()))
            return checks.every(x => x)
        })
        return data
    }

    const [open, setOpen] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const [selectedValue, setSelectedValue] = React.useState<any>({});
    const [status, setStatus] = React.useState<'notLoaded' | 'loaded'>('notLoaded');
    const handleClickOpen = (x: any) => {
        setOpen(true)
        setSelectedValue(x)
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <h1 className={styles.mainHeader}>pokemons</h1>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    <CardHeader
                        titleTypographyProps={{ variant: 'h2' }}
                        subheaderTypographyProps={{ variant: 'h5' }}
                        title={selectedValue.name}
                        subheader={selectedValue.generation}
                        avatar={
                            <Avatar src={selectedValue.principalImage} sx={{ width: 'auto', height: 'auto' }}></Avatar>
                        }
                    />
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => handleClose()}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers sx={{ maxWidth: '450px' }}>
                    <CardContent>
                        <ThemeProvider theme={theme}>
                            <Typography variant="h4">Tipos</Typography>
                            <List dense={true} disablePadding>

                                {selectedValue.types ? selectedValue.types.map((type: any, index: number) => {
                                    return <div key={index}><ListItem><ListItemText primaryTypographyProps={{ fontSize: '14px' }} secondaryTypographyProps={{ fontSize: '12px' }}
                                        primary={type}
                                    /></ListItem><Divider /></div>
                                }) : ''}

                            </List>
                            <Typography variant="h4" sx={{ mt: 3 }}>Estadísticas</Typography>
                            <List dense={true} disablePadding>

                                {selectedValue.stats ? selectedValue.stats.map((stat: any, index: number) => {
                                    return <div key={index}><ListItem><ListItemText primaryTypographyProps={{ fontSize: '14px' }} secondaryTypographyProps={{ fontSize: '12px' }}
                                        primary={stat.stat}
                                        secondary={stat.value}
                                    /></ListItem><Divider /></div>
                                }) : ''}

                            </List>
                            <Typography variant="h4" sx={{ mt: 3 }}>Evoluciones</Typography>
                            <List dense={true} disablePadding>

                                {selectedValue.evolutions ? selectedValue.evolutions.map((evolution: any, index: number) => {
                                    return <div key={index}><ListItem>
                                        <ListItemAvatar>
                                            <Avatar src={evolution.image} sx={{ width: 'auto', height: 'auto' }}></Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primaryTypographyProps={{ fontSize: '14px', fontWeight: evolution.principal ? 'bold' : '' }}
                                            primary={evolution.name}
                                            secondary={(evolution.principal ? '(Actual)' : '') + ' ' + (index > 0 ? 'Evolución ' + (index) : '')}
                                        /></ListItem><Divider /></div>
                                }) : ''}

                            </List>

                        </ThemeProvider>
                    </CardContent>
                </DialogContent>
            </BootstrapDialog>
            {
                (status === 'notLoaded') ?
                    <>
                        <Loader />
                    </>
                    :
                    <>
                        <Table responsive striped>
                            <thead>
                                <tr>
                                    <th style={{width: '75px'}}><Form.Control size="sm" type="text" value={id} placeholder="Id." onChange={e => modifyId(e.target.value)}></Form.Control></th>
                                    <th><Form.Control size="sm" type="text" value={name} placeholder="Nombre" onChange={e => modifyName(e.target.value)}></Form.Control></th>
                                    <th style={{width: '20%'}}><Form.Control size="sm" type="text" value={generation} placeholder="Generación" onChange={e => modifyGeneration(e.target.value)}></Form.Control></th>
                                    <th style={{width: '25%'}}><Form.Control size="sm" type="text" value={type} placeholder="Tipos" onChange={e => modifyType(e.target.value)}></Form.Control></th>
                                    <th style={{width: '125px'}}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterPokemons().length > 0 ? filterPokemons().map((x: any, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td>{x.id}</td>
                                            <td>{x.name}</td>
                                            <td>{x.generation}</td>
                                            <td>{x.types ? x.types.join(', ') : ''}</td>
                                            <td>
                                                <Button variant="outlined" onClick={() => handleClickOpen(x)}>
                                                    Ver detalles
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                }) : <tr><td colSpan={5}><center><em>Sin resultados</em></center></td></tr>}
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