export default {
  ground: {
    size: [500, 500],
  },

  GUIControls: {
    archor: 'top_left',
    collapsed: false,
    defaultClosedGroups: ['Player', 'View'],
    title: 'Controls',
    width: 300,
  },

  maze: {
    showCollisions: false,
    gltf: '/gltf/labirinto.glb',
  },

  player: {
    speed: 5,
    radius: 0.7,
    initialPos: [-67, 2, 32],
  },
}
