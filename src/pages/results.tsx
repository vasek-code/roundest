import { GetServerSideProps, NextPage } from "next/types";
import { trpc } from "../utils/trpc";
import NextImage from "next/image";
import { prisma } from "../../prisma/prisma";
import { Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    select: {
      id: true,
      name: true,
      spriteURL: true,
      Vote: {
        select: {
          id: true,
          pokemon: true,
          pokemonDexId: true,
        },
      },
      dexId: true,
    },
    orderBy: {
      Vote: { _count: "desc" },
    },
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const ResultsPage: React.FC<{
  pokemon: PokemonQueryResult;
}> = ({ pokemon }) => {
  return (
    <Flex
      w="100%"
      h="100vh"
      flexDir="column"
      pt="50px"
      gap="10px"
      px="20px"
      align="center"
    >
      <Text fontSize="30px" fontWeight="bold">
        Who is Roundest?
      </Text>
      <Link href="/">
        <Button
          variant="link"
          fontSize="18px"
          fontWeight="semibold"
          pb="30px"
          color="gray.500"
        >
          Back to voting
        </Button>
      </Link>
      {pokemon?.map((p) => {
        return <PokemonList key={p.id} p={p} />;
      })}
    </Flex>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  return { props: { pokemon: pokemonOrdered } };
};

const PokemonList: React.FC<{
  p: {
    Vote: {
      pokemon: { id: string; name: string; spriteURL: string; dexId: number };
      id: string;
      pokemonDexId: number;
    }[];
    id: string;
    name: string;
    spriteURL: string;
    dexId: number;
  };
}> = (props) => {
  return (
    <>
      <Flex
        maxH="100px"
        w="100%"
        justify="space-between"
        px="100px"
        align="center"
        background="#2c313d"
        borderRadius="5px"
      >
        <NextImage
          alt={props.p.name}
          width="100px"
          height="100px"
          layout="fixed"
          src={props.p.spriteURL}
        />
        <Text fontSize="25px" fontWeight="bold">
          {props.p.name[0].toUpperCase()}
          {props.p.name.slice(1)}
        </Text>
        <Text fontSize="15px" fontWeight="bold">
          Number of votes: {props.p.Vote.length}
        </Text>
      </Flex>
    </>
  );
};
