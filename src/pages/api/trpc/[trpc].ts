import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { PokemonClient } from "pokenode-ts";
import { prisma } from "../../../../prisma/prisma";

const pokeApi = new PokemonClient();

export const appRouter = trpc.router()
  .query("get-pokemon-pair", {

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


      const bothPokemon = await prisma.pokemon.findMany({
        where: { dexId: { in: [firstId, secondId] } },
      });


      if (bothPokemon.length !== 2)
        throw new Error("Failed to find two pokemon");

      return { firstPokemon: bothPokemon[0], secondPokemon: bothPokemon[1] };
    }
  })
  .mutation("make-vote", {
    input: z.object({
      votedFor: z.number()
    }),
    async resolve({ input }) {
      const voteInDb = await prisma.vote.create({
        data: {
          pokemonDexId: input.votedFor
        }
      })
      return { success: true, vote: voteInDb }
    }
  })

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
