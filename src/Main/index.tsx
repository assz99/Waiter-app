import { useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { Button } from '../components/Button'
import { Cart } from '../components/Cart'
import Categories from '../components/Categories'
import Header from '../components/Header'
import { Empty } from '../components/Icons/Empty'
import Menu from '../components/Menu'
import { TableModal } from '../components/TableModal'
import { Text } from '../components/Text'
import { CartItem } from '../types/CartItems'
import { Product } from '../types/product'
import {
  CategoriesContainer,
  CenteredrContainer,
  Container,
  Footer,
  FooterContainer,
  MenuContainer
} from './styles'

export default function Main () {
  const [isTableModalVisible, setIsTableModalVisible] = useState(false)
  const [selectedTable, setSelectedTable] = useState('')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  function handleSaveTable (table: string) {
    setSelectedTable(table)
    setIsTableModalVisible(false)
  }

  function handleResetOrder () {
    setSelectedTable('')
    setCartItems([])
  }

  function handleAddToCart (product: Product) {
    if (!selectedTable) {
      setIsTableModalVisible(true)
    }
    setCartItems(prevState => {
      const itemIndex = prevState.findIndex(
        cartItem => cartItem.product._id === product._id
      )

      if (itemIndex < 0) {
        return prevState.concat({
          quantity: 1,
          product
        })
      }

      const newCartItems = [...prevState]
      newCartItems[itemIndex] = {
        ...newCartItems[itemIndex],
        quantity: newCartItems[itemIndex].quantity + 1
      }
      return newCartItems
    })
  }

  function handleDecrementCartItem (product: Product) {
    setCartItems(prevState => {
      const itemIndex = prevState.findIndex(
        cartItem => cartItem.product._id === product._id
      )

      const item = prevState[itemIndex]
      const newCartItems = [...prevState]

      if (item.quantity === 1) {
        newCartItems.splice(itemIndex, 1)
        return newCartItems
      }

      newCartItems[itemIndex] = {
        ...newCartItems[itemIndex],
        quantity: newCartItems[itemIndex].quantity - 1
      }
      return newCartItems
    })
  }

  return (
    <>
      <Container>
        <Header
          selectedTable={selectedTable}
          onCancelOrder={handleResetOrder}
        />

        {isLoading && (
          <CenteredrContainer>
            <ActivityIndicator color='#D73035' size='large' />
          </CenteredrContainer>
        )}

        {!isLoading && (
          <>
            <CategoriesContainer>
              <Categories />
            </CategoriesContainer>

            {products.length > 0 ? (
              <MenuContainer>
                <Menu onAddToCart={handleAddToCart} products={products} />
              </MenuContainer>
            ) : (
              <CenteredrContainer>
                <Empty />

                <Text color='#666' style={{ marginTop: 24 }}>
                  Nenhum produto foi encontrado!
                </Text>
              </CenteredrContainer>
            )}
          </>
        )}
      </Container>

      <Footer>
        <FooterContainer>
          {!selectedTable && (
            <Button
              disable={isLoading}
              onPress={() => setIsTableModalVisible(true)}
            >
              Novo Pedido
            </Button>
          )}
          {selectedTable && (
            <Cart
              cartItems={cartItems}
              onAdd={handleAddToCart}
              onDecrement={handleDecrementCartItem}
              onConfirmOrder={handleResetOrder}
            />
          )}
        </FooterContainer>
      </Footer>

      <TableModal
        visible={isTableModalVisible}
        onClose={() => setIsTableModalVisible(false)}
        onSave={handleSaveTable}
      />
    </>
  )
}
