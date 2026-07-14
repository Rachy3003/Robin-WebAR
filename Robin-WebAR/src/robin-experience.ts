import * as ecs from '@8thwall/ecs'
import {ROBIN_CARDS} from './robin-content'

type ExperienceState = 'waiting' | 'prompted' | 'revealing' | 'revealed'

type ExperienceInstance = {
  cards: bigint[]
  tapTarget: bigint
  timers: number[]
  state: ExperienceState
}

const PROMPT_DELAY_MS = 10_000
const CARD_STAGGER_MS = 300
const instances = new Map<bigint, ExperienceInstance>()

const schedule = (
  world: ecs.World,
  instance: ExperienceInstance,
  callback: () => void,
  delay: number
) => {
  const timer = world.time.setTimeout(callback, delay)
  instance.timers.push(timer)
}

const makeCard = (world: ecs.World, parent: bigint, cardIndex: number) => {
  const card = ROBIN_CARDS[cardIndex]
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
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
    width: '210',
    height: '72',
    opacity: 0,
    background: '#FFFFFF',
    backgroundOpacity: 0.96,
    borderColor: card.color,
    borderWidth: 4,
    borderRadius: 19,
    color: '#073C31',
    text: card.topic,
    font: 'Roboto',
    fontSize: 25,
    textAlign: 'center',
    verticalTextAlign: 'center',
    padding: '11',
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
    duration: reducedMotion ? 180 : 560,
    loop: false,
    reverse: false,
    easeOut: true,
    easingFunction: reducedMotion ? 'Quadratic' : 'Back',
  })
  ecs.CustomPropertyAnimation.set(world, cardEid, {
    attribute: 'ui',
    property: 'opacity',
    autoFrom: false,
    from: 0,
    to: 1,
    duration: reducedMotion ? 180 : 460,
    loop: false,
    reverse: false,
    easeIn: false,
    easeOut: true,
    easingFunction: 'Quadratic',
  })
  return cardEid
}

const makeRobotTapTarget = (world: ecs.World, parent: bigint) => {
  const tapTarget = world.createEntity()
  world.setParent(tapTarget, parent)
  ecs.Position.set(world, tapTarget, {x: 0, y: 0.92, z: 0.2})
  ecs.Ui.set(world, tapTarget, {
    type: '3d',
    fixedSize: false,
    width: '260',
    height: '390',
    opacity: 0,
    backgroundOpacity: 0,
    text: '',
  })
  return tapTarget
}

const revealCards = (world: ecs.World, parent: bigint, instance: ExperienceInstance) => {
  if (instance.state !== 'prompted') return
  instance.state = 'revealing'

  ROBIN_CARDS.forEach((_, index) => {
    schedule(world, instance, () => {
      if (instance.state !== 'revealing') return
      instance.cards.push(makeCard(world, parent, index))
      if (index === ROBIN_CARDS.length - 1) instance.state = 'revealed'
    }, index * CARD_STAGGER_MS)
  })
}

ecs.registerComponent({
  name: 'robin-experience',
  add: (world, component) => {
    const instance: ExperienceInstance = {
      cards: [],
      tapTarget: makeRobotTapTarget(world, component.eid),
      timers: [],
      state: 'waiting',
    }
    instances.set(component.eid, instance)
    world.events.addListener(instance.tapTarget, ecs.input.UI_CLICK, () => {
      revealCards(world, component.eid, instance)
    })

    schedule(world, instance, () => {
      if (instance.state !== 'waiting') return
      instance.state = 'prompted'
      window.dispatchEvent(new CustomEvent('robin-prompt-ready'))
    }, PROMPT_DELAY_MS)

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
    const instance = instances.get(component.eid)
    if (!instance) return
    instance.timers.forEach(timer => world.time.clearTimeout(timer))
    instance.cards.forEach(eid => world.deleteEntity(eid))
    world.deleteEntity(instance.tapTarget)
    instances.delete(component.eid)
  },
})
