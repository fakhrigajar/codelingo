import { Award, Braces, Brain, Code2, Crown, Flame, MessageCircle, Sparkles, Sprout, Trophy, Zap } from 'lucide-react'

export const BADGE_ICONS = {
  award: Award,
  braces: Braces,
  brain: Brain,
  code: Code2,
  crown: Crown,
  flame: Flame,
  'message-circle': MessageCircle,
  sparkles: Sparkles,
  sprout: Sprout,
  trophy: Trophy,
  zap: Zap,
}

export const BADGE_ICON_NAMES = Object.keys(BADGE_ICONS)

export function getBadgeIcon(name) {
  return BADGE_ICONS[name] || Award
}
