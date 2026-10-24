import { Input, InputProps } from '@chakra-ui/react'

/** A file input whose "Choose file" button looks like an outline button. */
export const FileInput = (props: InputProps) => (
  <Input
    type="file"
    p={1}
    css={{
      '&::file-selector-button': {
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 'l2',
        bg: 'bg',
        px: 3,
        py: 1,
        mr: 3,
        fontWeight: 'medium',
        cursor: 'pointer',
      },
    }}
    {...props}
  />
)
