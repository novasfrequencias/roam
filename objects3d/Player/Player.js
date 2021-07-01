import { useSphere } from '@react-three/cannon'
import { PointerLockControls } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useControls } from 'leva'
import config from '../../config'
import KeyBindings from '../../config/keybindings.json'
import { useStore } from '../../store'

function Player() {
  const lockRef = useRef()
  const { onMove } = useStore((store) => store.actions)
  const { movement, game } = useStore((store) => store.state)
  const speed = config.player.speed

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: config.player.initialPos,
    args: config.player.radius,
  }))

  const { camera } = useThree()

  const currentVelocity = useRef([0, 0, 0])

  const { lockPointer } = useControls('player', { lockPointer: true })

  useEffect(
    () => {
      api.velocity.subscribe(
        (newVelocity) => (currentVelocity.current = newVelocity)
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    const onKeyDown = (event) => {
      const action = KeyBindings[event.code]
      if (action) onMove(action, true)
    }

    const onKeyUp = (event) => {
      const action = KeyBindings[event.code]
      if (action) onMove(action, false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useFrame(() => {
    camera.position.copy(ref.current.position)
    camera.position.y = config.player.height

    const frontVector = new Vector3(
      0,
      0,
      (movement.backward ? 1 : 0) - (movement.forward ? 1 : 0)
    )
    const sideVector = new Vector3(
      (movement.left ? 1 : 0) - (movement.right ? 1 : 0),
      0,
      0
    )

    const newVelocity = new Vector3()
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(camera.rotation)

    // api.velocity.set(newVelocity.x, movement.jump ? 2 : currentVelocity.current[1], newVelocity.z)
    api.velocity.set(newVelocity.x, currentVelocity.current[1], newVelocity.z)
  })

  // useEffect(() => {
  //   setPointerLock(lockRef)

  //   return () => {
  //     cleanPointerLock({})
  //   }
  // }, [lockRef, setPointerLock])

  return (
    <>
      <mesh ref={ref} />
      {game.mouse && lockPointer && <PointerLockControls ref={lockRef} />}
    </>
  )
}

export default Player
