import { Text } from '../Text'
import { Container } from './styles'

interface ButtonProps {
  children: string
  onPress: () => void
  disable?: boolean
}

export function Button ({ children, onPress, disable }: ButtonProps) {
  return (
    <Container onPress={onPress} disabled={disable}>
      <Text weight='600' color='#fff'>
        {children}
      </Text>
    </Container>
  )
}
