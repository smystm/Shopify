import { getProducts } from "@/app/helpers/productApi"
import type { AdminProduct } from "@/app/contracts/products"
import ProductCard from "@/app/components/products/ProductCard"

export default async function ProductsPage() {
   let products: AdminProduct[] = []
   try {
      products = await getProducts()
   } catch (err) {
      console.error("Failed to fetch products:", err)
   }

   return (
      <div className="p-6">
         <h1 className="mb-6 text-2xl font-bold">Products</h1>
         {products.length === 0 ? (
            <p className="text-zinc-500">No products found.</p>
         ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
               {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
               ))}
            </div>
         )}
      </div>
   )
}
