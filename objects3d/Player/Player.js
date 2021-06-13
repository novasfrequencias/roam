import { useSphere } from '@react-three/cannon'
import { PointerLockControls } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import config from '../../config'
import useKeyboard from '../../hooks/useKeyboard'

function Player() {
  const speed = config.player.speed

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: config.player.initialPos,
    args: config.player.radius,
  }))

  const movement = useKeyboard()

  const { camera } = useThree()

  const currentVelocity = useRef([0, 0, 0])

  useEffect(
    () => api.velocity.subscribe((newVelocity) => (currentVelocity.current = newVelocity)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useFrame(() => {
    camera.position.copy(ref.current.position)

    const frontVector = new Vector3(0, 0, (movement.backwards ? 1 : 0) - (movement.forward ? 1 : 0))
    const sideVector = new Vector3((movement.left ? 1 : 0) - (movement.right ? 1 : 0), 0, 0)

    const newVelocity = new Vector3()
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(camera.rotation)

    // api.velocity.set(newVelocity.x, movement.jump ? 2 : currentVelocity.current[1], newVelocity.z)
    api.velocity.set(newVelocity.x, currentVelocity.current[1], newVelocity.z)
  })

  return (
    <>
      <mesh ref={ref} />
      {/**<PointerLockControls />**/}
      <PointerLockControls />
    </>
  )
}

export default Player
