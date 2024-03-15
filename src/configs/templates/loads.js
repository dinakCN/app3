import { containers } from '@/configs/templates/types/container.js'
import { pallet } from '@/configs/templates/types/pallet.js'
import { trailer } from '@/configs/templates/types/trailer.js'
import { lorry } from '@/configs/templates/types/lorry.js'

const trucks = [...trailer, ...lorry]

export { trucks, containers, pallet }
