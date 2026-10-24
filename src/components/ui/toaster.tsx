import {
  Toaster as ChakraToaster,
  Portal,
  Stack,
  Toast,
  createToaster,
} from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'bottom',
  pauseOnPageIdle: true,
})

export const notifySuccess = (title: string) =>
  toaster.create({ title, type: 'success', closable: true })

export const notifyError = (action: string, error: Error) =>
  toaster.create({
    title: `${action} failed`,
    description: `${error.message}. Please try again later.`,
    type: 'error',
    closable: true,
  })

export const Toaster = () => (
  <Portal>
    <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
      {(toast) => (
        <Toast.Root width={{ md: 'sm' }}>
          <Toast.Indicator />
          <Stack gap="1" flex="1" maxWidth="100%">
            {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
            {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
          </Stack>
          {toast.closable && <Toast.CloseTrigger />}
        </Toast.Root>
      )}
    </ChakraToaster>
  </Portal>
)
