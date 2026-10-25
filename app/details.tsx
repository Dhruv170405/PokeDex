import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";


export default function Details() {
    const params = useLocalSearchParams();

    const pokemonName =
        typeof params.name === "string"
            ? params.name
            : Array.isArray(params.name)
                ? params.name[0]
                : undefined;

    const [pokemon, setPokemon] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (pokemonName) {
            fetchPokemonByName(pokemonName);
        }
    }, [pokemonName]);

    async function fetchPokemonByName(name: string) {
        try {
            setLoading(true);

            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${name}`
            );

            const data = await response.json();

            setPokemon(data);
        } catch (error) {
            console.log("Error fetching pokemon:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
    }

    if (!pokemon) {
        return <Text style={{ marginTop: 40 }}>No Pokemon Data Available</Text>;
    }

    if (loading || !pokemon) {
        return null; // or ActivityIndicator
    }


    return (
        <>
            <Stack.Screen
                options={{
                    title:
                        typeof params.name === "string"
                            ? params.name
                            : Array.isArray(params.name)
                                ? params.name[0]
                                : undefined,
                }}
            />

            <ScrollView
                contentContainerStyle={{
                    padding: 20,
                    gap: 20,
                    backgroundColor: "grey",
                }}
            >
                <View style={styles.card}>
                    <Text style={styles.name}>
                        {pokemon.name.toUpperCase()}
                    </Text>

                    <Image
                        style={styles.image}
                        source={{
                            uri: pokemon?.sprites?.other?.["official-artwork"]?.front_default,

                        }}
                    />

                    <Text style={styles.info}>Height: {pokemon.height}</Text>
                    <Text style={styles.info}>Weight: {pokemon.weight}</Text>

                    <Text style={styles.section}>Types</Text>
                    {pokemon.types.map((type: any) => (
                        <Text key={type.type.name} style={styles.info}>
                            {type.type.name}
                        </Text>
                    ))}

                    <Text style={styles.section}>Abilities</Text>
                    {pokemon.abilities.map((ability: any) => (
                        <Text key={ability.ability.name} style={styles.info}>
                            {ability.ability.name}
                        </Text>
                    ))}
                </View>
            </ScrollView>


        </>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 16,
    },
    info: {
        fontSize: 16,
        marginBottom: 8,
    },
    section: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 8,
    },
});
