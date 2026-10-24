import { Badge } from '@chakra-ui/react'
import { MdRssFeed } from 'react-icons/md'

/** Marks automated accounts, such as news channels. */
export const BotBadge = () => (
  <Badge colorPalette="orange" variant="subtle" size="sm" title="An automated account that posts news">
    <MdRssFeed />
    Channel
  </Badge>
)
