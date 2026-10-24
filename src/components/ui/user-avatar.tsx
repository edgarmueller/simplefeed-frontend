import { Avatar } from '@chakra-ui/react'

const PALETTES = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink']

/** The same name always gets the same color. */
function paletteFor(name = '') {
  let hash = 0
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0
  }
  return PALETTES[Math.abs(hash) % PALETTES.length]
}

export interface UserAvatarProps extends Avatar.RootProps {
  name?: string
  src?: string
}

/** An avatar showing the user's image, or their initials if there is none. */
export const UserAvatar = ({ name, src, ...rootProps }: UserAvatarProps) => (
  <Avatar.Root colorPalette={paletteFor(name)} variant="solid" {...rootProps}>
    <Avatar.Fallback name={name} />
    {src ? <Avatar.Image src={src} /> : null}
  </Avatar.Root>
)
