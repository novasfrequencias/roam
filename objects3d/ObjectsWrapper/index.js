import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OBJLoader } from 'three-stdlib'
import { useLoader } from '@react-three/fiber'
import useFocusOnNear from '@/hooks/useFocusOnNear'
import { useControls } from 'leva'
import { useStore } from '../../store'
import { createDefaultInteraction } from '@/helpers/mock'
import MediaFactory from '@/helpers/mediaFactory'
import objects from '@/data/objects'
import contentObjects from '@/data/contentObjects'
import positions from '@/data/positions'

const PrimitiveObject = ({
  position,
  path,
  material,
  media,
  log = false,
  scale = 1,
}) => {
  const { onChangeInteraction, addGlow } = useStore((state) => state.actions)
  const ref = useRef(null)
  const object = useLoader(OBJLoader, path)

  useEffect(() => {
    if (log) console.warn(ref)
  }, [log, ref])

  useEffect(() => {
    if (!ref.current) return undefined

    const meshes = ref.current.children
      .filter((children) => children.type === 'Mesh')
      .map((mesh) => {
        mesh.material = material
        return { current: mesh }
      })

    addGlow(meshes)
  }, [ref, material, addGlow])

  useFocusOnNear({
    ref: ref,
    onFocus: () => onChangeInteraction(createDefaultInteraction({ media })),
    onDefocus: () => onChangeInteraction(null),
  })

  return (
    <primitive
      ref={ref}
      position={position}
      scale={[1 * scale, 1 * scale, 1 * scale]}
      object={object}
    />
  )
}

const ObjectsWrapper = () => {
  useControls(
    'material',
    {
      color: {
        value: '#00ff00',
        onChange: (value) => (defaultMaterial.color = new THREE.Color(value)),
      },
      wireframe: {
        value: false,
        onChange: (value) => (defaultMaterial.wireframe = value),
      },
      transparent: {
        value: false,
        onChange: (value) => (defaultMaterial.transparent = value),
      },
      opacity: {
        value: 1,
        onChange: (value) => (defaultMaterial.opacity = value),
      },
      visible: {
        value: true,
        onChange: (value) => (defaultMaterial.visible = value),
      },
      shininess: {
        value: 100,
        onChange: (value) => (defaultMaterial.shininess = value),
      },
      emissive: {
        value: '#00ff00',
        onChange: (value) =>
          (defaultMaterial.emissive = new THREE.Color(value)),
      },
      emissiveIntensity: {
        value: 0.5,
        onChange: (value) => (defaultMaterial.emissiveIntensity = value),
      },
      fog: {
        value: true,
        onChange: (value) => (defaultMaterial.fog = value),
      },
      reflectivity: {
        value: 1,
        onChange: (value) => (defaultMaterial.reflectivity = value),
      },
      refractionRatio: {
        value: 0.98,
        onChange: (value) => (defaultMaterial.refractionRatio = value),
      },
      specular: {
        value: '#ffffff',
        onChange: (value) =>
          (defaultMaterial.specular = new THREE.Color(value)),
      },
    },
    { collapsed: true }
  )

  const defaultMaterial = useRef(
    new THREE.MeshPhongMaterial({ side: THREE.FrontSide })
  ).current

  return positions.map((position, i) => {
    const object = objects[i]
    const content = MediaFactory(contentObjects[i])

    if (!object) return null

    return (
      <PrimitiveObject
        key={object.path}
        scale={object.scale || 1}
        path={object.path}
        position={position}
        material={defaultMaterial}
        media={content}
      />
    )
  })
}

export default ObjectsWrapper
