import AddItem from "../../../component/Items/AddItem"
import ItemsList from "../../../component/Items/ItemsList"


const AddItemPage = () => {
  return (
    <>
    <AddItem/>
    <div className="mt-4">
    <ItemsList/>
    </div>
    </>
  )
}

export default AddItemPage
