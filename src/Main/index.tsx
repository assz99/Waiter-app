import { useEffect, useState } from 'react'

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
import { Category } from '../types/Category'
import { Product } from '../types/product'
import { api } from '../utils/api'
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
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  useEffect(() => {
    Promise.all([api.get('/categories'), api.get('/products')]).then(
      ([categoriesResponse, productsResponse]) => {
        setCategories(categoriesResponse.data)
        setProducts(productsResponse.data)
        setIsLoading(false)
      }
    )
  }, [])

  async function handleSelectCategory (categoryId: string) {
    const route = !categoryId
      ? '/products'
      : `/categories/${categoryId}/products`
    setIsLoadingProducts(true)
    const { data } = await api.get(route)
    setProducts(data)
    setIsLoadingProducts(false)
  }

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
              <Categories
                categories={categories}
                onSelectCategory={handleSelectCategory}
              />
            </CategoriesContainer>

            {isLoadingProducts ? (
              <CenteredrContainer>
                <ActivityIndicator color='#D73035' size='large' />
              </CenteredrContainer>
            ) : (
              <>
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
              selectedTable={selectedTable}
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
