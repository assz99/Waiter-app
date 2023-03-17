import { useState } from 'react'
import { FlatList } from 'react-native'
import { products } from '../../mocks/products'
import { Product } from '../../types/product'
import formatCurrency from '../../utils/formatCurrency'
import { PlusCircle } from '../Icons/PlusCircle'
import { ProductModal } from '../ProductModal/index'
import { Text } from '../Text'
import {
  ProductImage,
  ProductContainer,
  ProductDetails,
  Separator,
  AddToCartButton
} from './styles'

export default function Menu () {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<null | Product>(null)

  function handleOpenModal (product: Product) {
    setIsModalVisible(true)
    setSelectedProduct(product)
  }

  return (
    <>
      <ProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        product={selectedProduct}
      ></ProductModal>

      <FlatList
        data={products}
        style={{ marginTop: 32 }}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        keyExtractor={product => product._id}
        ItemSeparatorComponent={Separator}
        renderItem={({ item: product }) => (
          <ProductContainer onPress={() => handleOpenModal(product)}>
            <ProductImage
              source={{
                uri: `http://localhost:3001/uploads/${product.imagePath}`
              }}
            />
            <ProductDetails>
              <Text weight='600'>{product.name}</Text>
              <Text size={14} color='#666' style={{ marginVertical: 8 }}>
                {product.description}
              </Text>
              <Text size={14} weight='600'>
                {formatCurrency(product.price)}
              </Text>
            </ProductDetails>

            <AddToCartButton>
              <PlusCircle />
            </AddToCartButton>
          </ProductContainer>
        )}
      />
    </>
  )
}
