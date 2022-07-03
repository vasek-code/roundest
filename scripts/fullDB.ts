import { PokemonClient } from "pokenode-ts";

import { prisma } from "../prisma/prisma";

const doBackfill = async () => {
  const pokeApi = new PokemonClient();

  const allPokemon = await pokeApi.listPokemons(0, 493);

  const formattedPokemon = allPokemon.results.map((p, index) => ({
    dexId: index + 1,
    name: (p as { name: string }).name,
    spriteURL: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1
      }.png` as string,
  }));

  const creation = await prisma.pokemon.createMany({
    data: formattedPokemon,
  });

  console.log("Creation?", creation);
};

doBackfill();