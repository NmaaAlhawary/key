// Icons from Phosphor (duotone). Names stay short so pages read cleanly.
import {
  Package, Door, Key, Vault, UserCircle, Coins, MapPin, Sparkle, ShieldCheck, UsersThree, Wrench,
  Microphone, Clock, ChatsCircle, Camera, PencilSimple, Waveform, Lightbulb, Cpu, MagnifyingGlass,
  Handshake, PresentationChart, CheckCircle, Robot, Trophy, DeviceMobile, Truck, ForkKnife, Bank, HandHeart, Toolbox,
} from '@phosphor-icons/react'

const MAP = {
  box: Package, door: Door, key: Key, vault: Vault, user: UserCircle, coin: Coins, pin: MapPin, spark: Sparkle,
  shield: ShieldCheck, people: UsersThree, tool: Wrench, mic: Microphone, clock: Clock, chat: ChatsCircle,
  camera: Camera, pencil: PencilSimple, wave: Waveform, idea: Lightbulb, cpu: Cpu, search: MagnifyingGlass,
  hand: Handshake, pitch: PresentationChart, check: CheckCircle, robot: Robot, trophy: Trophy,
  phone: DeviceMobile, truck: Truck, food: ForkKnife, bank: Bank, heart: HandHeart, toolbox: Toolbox,
}

export default function Icon({ name, size = 28, color = 'currentColor', weight = 'duotone' }) {
  const C = MAP[name] || Sparkle
  return <C size={size} color={color} weight={weight} aria-hidden="true" />
}
