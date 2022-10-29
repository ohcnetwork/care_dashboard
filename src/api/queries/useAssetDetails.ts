import axios from 'axios'
import { useQuery } from 'react-query'
import { createQueryKey } from '../../utils/url'
import { AssetDetails } from '../common/types/assetsDetails'

const ASSET_DETAILS_KEY = 'assetDetailsKey'

export interface AssetDetailsQuery {
  /* ASSET ID */
  id?: string
}

export const useAssetDetails = (
  { id, ...query }: AssetDetailsQuery,
  enabled = true
) =>
  useQuery(
    createQueryKey(ASSET_DETAILS_KEY, { id, ...query }),
    () =>
      axios
        .get<AssetDetails>(
          `${import.meta.env.VITE_API_URL}/api/v1/public/asset/${id || ''}`,
          {
            params: query,
          }
        )
        .then((d) => d.data),
    {
      enabled,
    }
  )
