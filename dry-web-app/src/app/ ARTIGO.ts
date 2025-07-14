// Interface for an object shape
interface User {
  id: number
  name: string
}

// Type alias for a union type
type StringOrNumber = string | number

// Type alias for an object shape (also possible)
type Product = {
  sku: string
  price: number
}

// Interface extending another
interface AdminUser extends User {
  isAdmin: true
}

// Type alias using intersection
type DetailedProduct = Product & {
  description: string
}
