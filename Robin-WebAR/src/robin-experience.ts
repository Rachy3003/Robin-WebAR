import * as ecs from '@8thwall/ecs'
import {ROBIN_CARDS} from './robin-content'

const childCards = new Map<bigint, bigint[]>()

const makeCard = (world: ecs.World, parent: bigint, cardIndex: number) => {
  const card = ROBIN_CARDS[cardIndex]
  const cardEid = world.createEntity()
  world.setParent(cardEid, parent)
  ecs.Position.set(world, cardEid, {
    x: card.position[0],
    y: card.position[1],
    z: card.position[2],
  })
  ecs.Ui.set(world, cardEid, {
    type: '3d',
    fixedSize: false,
    width: '250',
    height: '82',
    background: '#FFFFFF',
    backgroundOpacity: 0.96,
    borderColor: card.color,
    borderWidth: 5,
    borderRadius: 22,
    color: '#073C31',
    text: card.topic,
    font: 'Roboto',
    fontSize: 30,
    textAlign: 'center',
    verticalTextAlign: 'center',
    padding: '14',
  })
  world.events.addListener(cardEid, ecs.input.UI_CLICK, () => {
    window.dispatchEvent(new CustomEvent('robin-card-selected', {detail: card}))
  })
  ecs.ScaleAnimation.set(world, cardEid, {
    autoFrom: false,
    fromX: 0.01,
    fromY: 0.01,
    fromZ: 0.01,
    toX: 1,
    toY: 1,
    toZ: 1,
    duration: 650 + cardIndex * 110,
    loop: false,
    reverse: false,
    easeOut: true,
    easingFunction: 'Back',
  })
  return cardEid
}

ecs.registerComponent({
  name: 'robin-experience',
  add: (world, component) => {
    const cards = ROBIN_CARDS.map((_, index) => makeCard(world, component.eid, index))
    childCards.set(component.eid, cards)

    const position = ecs.math.vec3.zero()
    world.transform.getLocalPosition(component.eid, position)
    ecs.PositionAnimation.set(world, component.eid, {
      autoFrom: false,
      fromX: position.x,
      fromY: position.y,
      fromZ: position.z,
      toX: position.x,
      toY: position.y + 0.045,
      toZ: position.z,
      duration: 2200,
      loop: true,
      reverse: true,
      easeIn: true,
      easeOut: true,
      easingFunction: 'Sine',
    })
    window.dispatchEvent(new CustomEvent('robin-placed'))
  },
  remove: (world, component) => {
    childCards.get(component.eid)?.forEach(eid => world.deleteEntity(eid))
    childCards.delete(component.eid)
  },
})
