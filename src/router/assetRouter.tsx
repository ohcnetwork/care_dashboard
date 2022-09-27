import { Asset } from '../pages/asset/Asset'
import AssetDetails from '../pages/asset/AssetDetails'

export const assetRouter = {
  '/assets': () => <Asset />,
  '/assets/:id': (props: Record<string, string>) => (
    <AssetDetails id={props.id} />
  ),
}
