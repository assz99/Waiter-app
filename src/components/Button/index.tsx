import { ActivityIndicator } from 'react-native'
import { Text } from '../Text'
import { Container } from './styles'

interface ButtonProps {
  children: string
  onPress: () => void
  disable?: boolean
  loading?: boolean
}

export function Button ({ children, onPress, disable, loading }: ButtonProps) {
  return (
    <Container onPress={onPress} disabled={disable || loading}>
      {!loading && (
        <Text weight='600' color='#fff'>
          {children}
        </Text>
      )}
      {loading && <ActivityIndicator color='#fff' />}
    </Container>
  )
}
