import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface Pokemon {
  name: string;
  images: string;
  imagesBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorsByType: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};


export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  console.log(JSON.stringify(pokemons[0], null, 2));
  useEffect(() => {
    // fetchPokemons()
    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=151"
      );
      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemons: any) => {
          const response = await fetch(pokemons.url);
          const data = await response.json();
          return {
            name: data.name,
            images: data.sprites.front_default,
            imagesBack: data.sprites.back_default,
            types: data.types,
          };
        })
      );

      console.log(detailedPokemons);

      setPokemons(detailedPokemons);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
      }}
    >
      {pokemons.map((pokemon, idx) => (
        <Link
          key={pokemon.name}
          href={{ pathname: "/details", params: { name: pokemon.name } }}
          style={{
            // @ts-ignore
            backgroundColor: colorsByType[pokemon.types[0].type.name] + 33,
            padding: 30,
            borderRadius: 30,
            marginBottom: idx === pokemons.length - 1 ? 0 : 16,
          }}
        >
          <View
            key={pokemon.name}

          >
            <Text style={styles.name}>{pokemon.name}</Text>
            <Text style={styles.type}>{pokemon.types[0].type.name}</Text>

            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <Image
                source={{ uri: pokemon.images }}
                style={{ width: 150, height: 150 }}
              />
              <Image
                source={{ uri: pokemon.imagesBack }}
                style={{ width: 150, height: 150 }}
              />
            </View>
          </View>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    color: "grey",
    textAlign: "center",
  }
})