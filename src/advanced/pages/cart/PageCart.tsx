import { SectionCart } from "./SectionCart/SectionCart.tsx"
import { SectionProductList } from "./SectionProducts/SectionProductList.tsx"

function PageCart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <SectionProductList />
      </div>

      <SectionCart />
    </div>
  )
}

export default PageCart
