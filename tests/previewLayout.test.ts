import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('previewLayout styles and templates', () => {
  const tierBlockPath = resolve(process.cwd(), 'app/components/preview/TierBlock.vue')
  const previewPanelPath = resolve(process.cwd(), 'app/components/preview/PreviewPanel.vue')

  const tierBlockSource = readFileSync(tierBlockPath, 'utf-8')
  const previewPanelSource = readFileSync(previewPanelPath, 'utf-8')

  it('does not render border between first and second level', () => {
    expect(tierBlockSource).toMatch(/index === 0 \? 'border-b-0(\s+h-\[141px\])?'/)
    expect(tierBlockSource).toContain('first:border-b-0')
    expect(previewPanelSource).toContain(':index="index"')
  })

  it('renders separators with border styling on subsequent tiers', () => {
    expect(tierBlockSource).toMatch(/border-b\s+(border-[a-z0-9-]+)/)
    expect(tierBlockSource).toContain('last:border-b-0')
    expect(tierBlockSource).not.toContain('border-sky-300/40')
  })

  it('removes padding from preview export target container and ensures it does not shrink, enabling scroll', () => {
    expect(previewPanelSource).not.toMatch(/class="[^"]*p-6[^"]*rounded-xl[^"]*"/)
    expect(previewPanelSource).toContain('shrink-0 rounded-xl overflow-hidden')
    expect(previewPanelSource).not.toContain('space-y-4 w-full h-full')
  })

  it('allows the tiers container to grow in height for scrolling', () => {
    expect(previewPanelSource).not.toMatch(/<div class="relative z-10 flex flex-col w-full h-full">/)
    expect(previewPanelSource).toContain('<div class="relative z-10 flex flex-col w-full">')
  })

  it('centers items within each level in preview', () => {
    expect(tierBlockSource).toContain('justify-center')
    expect(tierBlockSource).toMatch(/flex flex-wrap items-center justify-center/)
  })

  it('styles level titles with white text on black background in the top-left corner', () => {
    expect(tierBlockSource).toContain('justify-start')
    expect(tierBlockSource).toContain('bg-black')
    expect(tierBlockSource).toContain('text-white')
    expect(tierBlockSource).not.toContain(':style="{ backgroundColor: level.color }"')
  })

  it('ensures no comments are present in changed component files', () => {
    const singleLineCommentRegex = /(?<!:)\/\/.+/
    const multiLineCommentRegex = /\/\*[\s\S]*?\*\//
    const htmlCommentRegex = /<!--[\s\S]*?-->/

    expect(tierBlockSource).not.toMatch(singleLineCommentRegex)
    expect(tierBlockSource).not.toMatch(multiLineCommentRegex)
    expect(tierBlockSource).not.toMatch(htmlCommentRegex)

    expect(previewPanelSource).not.toMatch(singleLineCommentRegex)
    expect(previewPanelSource).not.toMatch(multiLineCommentRegex)
    expect(previewPanelSource).not.toMatch(htmlCommentRegex)
  })
})
