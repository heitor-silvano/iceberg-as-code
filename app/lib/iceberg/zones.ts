export interface ZoneMetadata {
  zone: string
  depth?: string
  color: string
}

const DEFAULT_ZONES: ZoneMetadata[] = [
  { zone: 'THE SURFACE', depth: undefined, color: '#06b6d4' },
  { zone: 'SHALLOW WATERS', depth: '-200m (Sunlit)', color: '#0ea5e9' },
  { zone: 'TWILIGHT ZONE', depth: '-1,000m (Twilight)', color: '#3b82f6' },
  { zone: 'MIDNIGHT ZONE', depth: '-4,000m (Midnight)', color: '#6366f1' },
  { zone: 'THE ABYSS', depth: '-6,000m (Abyssal)', color: '#8b5cf6' },
  { zone: 'THE TRENCH', depth: '-11,000m (Hadal)', color: '#ec4899' },
]

export function getTierMetadata(index: number, totalTiers: number): ZoneMetadata {
  if (index < DEFAULT_ZONES.length) {
    return DEFAULT_ZONES[index]!
  }

  const progress = Math.min(1, index / Math.max(totalTiers - 1, 1))
  return {
    zone: `DEPTH LEVEL ${index + 1}`,
    depth: `-${11000 + (index - 5) * 2000}m (Void)`,
    color: '#ef4444',
  }
}
