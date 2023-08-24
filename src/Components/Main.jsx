import React, { useEffect, useState } from 'react';
import Card from './Card';
import Pokeinfo from './Pokeinfo';
import SingleCard from './SingleCard';
import axios from 'axios';

const Main = () => {
    const [pokeData, setPokeData] = useState([]);
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchMode, setSearchMode] = useState(false);
    const [pokemonHolder, setPokemonHolder] = useState('');
    const [url, setUrl] = useState(`https://pokeapi.co/api/v2/pokemon/`);
    const [nextUrl, setNextUrl] = useState();
    const [prevUrl, setPrevUrl] = useState();
    const [pokeDex, setPokeDex] = useState();


    // const pokeFun = async()=>{
    //     setLoading(true);
    //     const res = await axios.get(url);
    //     if (res.data.results) {
    //         console.log(res.data);
    //         setNextUrl(res.data.next);
    //         setPrevUrl(res.data.previous);
    //         getPokemon(res.data.results);
    //         setLoading(false);
    //     } else {
    //         console.log("it workeedd!");
    //     }
    //     // console.log(pokeData);
    // }

    const pokeFun = async () => {
        setLoading(true);
        try {
            if (searchMode) {
                // Search mode: Fetch data for the specified Pokémon
                const res = await axios.get(url);
                if (res.data) {
                    console.log(res.data);
                    setPokeDex(res.data);
                    setPokeData([res.data]);
                    console.log(pokemon);
                } else {
                    console.log("No data found for the searched Pokémon.");
                }
            } else {
                // Pagination mode: Fetch the next or previous page of data
                const res = await axios.get(url);
                if (res.data.results) {
                    setNextUrl(res.data.next);
                    setPrevUrl(res.data.previous);
                    getPokemon(res.data.results);
                } else {
                    console.log("No data found for pagination.");
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    

    const getPokemon = async(res) => {
        res.map(async(item) =>{
            const result = await axios.get(item.url);
            setPokeData(state => {
                state = [...state, result.data];    // ...は「まず全てstoreしてarr作って」って意味
                state.sort((a, b)=> a.id > b.id ? 1 : -1);
                return state;
            })
        })
    }

    useEffect(()=>{
        pokeFun();
    },[url])

    // useEffect(() => {
    //     onePokeFun();
    // }, [pokemon])

    const changePokemon = (event) => {
        if (event.key === 'Enter') {
            setSearchMode(true);
            setUrl(`https://pokeapi.co/api/v2/pokemon/${event.target.value}`);
        }
    }

    const handlePagination = (newUrl) => {
        setSearchMode(false); // Set search mode to false
        setPokeData([]); // Reset the data array
        setUrl(newUrl); // Update the URL for pagination
    }

    const handleChange = (event) => {
        setPokemonHolder(event.target.value);
    }
    
    return (
    <>
        <div className="container">
            <div className="container-search">
                <input value={pokemonHolder}
                    onChange={handleChange} 
                    onKeyDown={changePokemon}
                    placeholder="Search Pokemon"
                    type="text"></input>
            </div>
            <div className='container-content'>
                <div className="left-content">
                    {searchMode ? (
                        <>
                        {console.log(pokeData)}
                        <SingleCard pokemon={pokeData} loading={loading} infoPokemon={poke => setPokeDex(poke)} />
                      </>
                    ) : (
                        <Card pokemon={pokeData} loading={loading} infoPokemon={poke => setPokeDex(poke)} />
                    )}
                    

                    <div className="btn-group">
                        {searchMode ? (
                            <button onClick={() => {
                                setSearchMode(false);
                                setUrl('https://pokeapi.co/api/v2/pokemon/');
                                setPokemonHolder('');
                            }}>Back</button>
                        ) : (
                        /* Pagination buttons */
                        <>
                        {prevUrl && <button onClick={() => handlePagination(prevUrl)}>Previous</button>}
                        {nextUrl && <button onClick={() => handlePagination(nextUrl)}>Next</button>}
                        </>
                        )}
                    </div>
                </div>
            </div>
            <div className="right-content">
                <Pokeinfo data={pokeDex} />
            </div>
        </div>
    </>
  )
}

export default Main;