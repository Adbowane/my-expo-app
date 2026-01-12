import { SafeAreaView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber/native';
import useControls from 'r3f-native-orbitcontrols';
import { Character } from '../components/Character';

type Props = {};

function LoadingFallback() {
    return null;
}

const CharacterScreen = (props: Props) => {
    const [OrbitControls, events] = useControls();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.modelContainer} {...events}>
                <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                    <OrbitControls />
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[5, 5, 5]} intensity={1} />
                    <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                    <Suspense fallback={<LoadingFallback />}>
                        <Character />
                    </Suspense>
                </Canvas>
            </View>
        </SafeAreaView>
    );
};

export default CharacterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffffff',
    },
    modelContainer: {
        flex: 1,
    },
});