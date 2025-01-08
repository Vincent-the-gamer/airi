import type { Bot } from 'mineflayer'
import type { BotContext } from '../composables/bot'
import { useLogg } from '@guiiai/logg'

let ctx: SkillContext | undefined
const logger = useLogg('skills').useGlobalConfig()

export function useSkillContext(botCtx: BotContext): SkillContext {
  if (!ctx) {
    logger.log('Creating skill context')
    ctx = createSkillContext(botCtx)
  }

  return ctx
}

/**
 * Context for skill execution
 */
export interface SkillContext {
  bot: Bot
  botCtx: BotContext
  // Whether the bot is in creative mode
  isCreative: boolean
  // Whether the bot should use cheats (like /tp, /setblock)
  allowCheats: boolean
  // Whether the bot should interrupt current action
  shouldInterrupt: boolean
  // Output buffer for logging
  output: string[]
}

/**
 * Create a new skill context
 */
export function createSkillContext(ctx: BotContext): SkillContext {
  return {
    bot: ctx.bot,
    botCtx: ctx,
    isCreative: ctx.bot.game?.gameMode === 'creative',
    allowCheats: false,
    shouldInterrupt: false,
    output: [],
  }
}

/**
 * Log a message to the context's output buffer
 */
export function log(ctx: SkillContext, message: string): void {
  ctx.output.push(message) // TODO: remove this
  ctx.bot.chat(message)
}

/**
 * Position in the world
 */
export interface Position {
  x: number
  y: number
  z: number
}

/**
 * Block face direction
 */
export type BlockFace = 'top' | 'bottom' | 'north' | 'south' | 'east' | 'west' | 'side'
