import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei/native'
import * as THREE from 'three'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
    nodes: {
        Maria_J_J_Ong: THREE.SkinnedMesh
        mixamorigHips: THREE.Bone
    }
    materials: {
        maria_M1: THREE.MeshStandardMaterial
    }
}

const modelPath = require('../assets/air-squat.glb')

export function Character(props: JSX.IntrinsicElements['group']) {
    const group = useRef<THREE.Group>(null)
    const { nodes, materials, animations, scene } = useGLTF(modelPath) as GLTFResult
    const { actions, names } = useAnimations(animations, group)

    // Démarrer l'animation automatiquement
    useEffect(() => {
        if (names.length > 0 && actions[names[0]]) {
            actions[names[0]]?.reset().fadeIn(0.5).play()
        }
        return () => {
            names.forEach((name) => actions[name]?.fadeOut(0.5))
        }
    }, [actions, names])

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01} position={[0, -1, 0]}>
                    <primitive object={nodes.mixamorigHips} />
                    <skinnedMesh
                        name="Maria_J_J_Ong"
                        geometry={nodes.Maria_J_J_Ong.geometry}
                        material={materials.maria_M1}
                        skeleton={nodes.Maria_J_J_Ong.skeleton}
                    />
                </group>
            </group>
        </group>
    )
}

useGLTF.preload(modelPath)