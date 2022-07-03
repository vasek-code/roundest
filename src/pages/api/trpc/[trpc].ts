import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { PokemonClient } from "pokenode-ts";

const pokeApi = new PokemonClient();

export const appRouter = trpc.router().query("get-pokemon-pair", {

  async resolve() {
    const MAX_DEX_ID = 493;

    const getRandomPokemon: (notThisOne?: number) => number = (
      notThisOne
    ) => {
      const pokedexNumber = Math.floor(Math.random() * MAX_DEX_ID) + 1;

      if (pokedexNumber !== notThisOne) return pokedexNumber;
      return getRandomPokemon(notThisOne);
    };

    const getOptionsForVote = () => {
      const firstId = getRandomPokemon();
      const secondId = getRandomPokemon(firstId);

      return [firstId, secondId];
    };

    const [firstId, secondId] = getOptionsForVote();


    const firstPokemon = await pokeApi.getPokemonById(firstId);
    const secondPokemon = await pokeApi.getPokemonById(secondId);


    return { firstPokemon: { name: firstPokemon.name, spriteURL: firstPokemon.sprites.other["official-artwork"].front_default }, secondPokemon: { name: secondPokemon.name, spriteURL: secondPokemon.sprites.other["official-artwork"].front_default } };
  }
})

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
