import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useAssetDetails } from '../../api/queries/useAssetDetails'
import { LabelText } from '../../components/LabelText'
import { navigate } from 'raviger'
import { AxiosError } from 'axios'

interface Props {
  id?: string
}

export const AssetDetailsSkeleton = () => {
  return (
    <section className="my-4 w-full">
      <div className="w-full 2xl:max-w-7xl mx-auto px-4">
        <div className="bg-slate-800 rounded-2xl animate-pulse h-72 mb-6" />
      </div>
    </section>
  )
}

const AssetDetails = (props: Props) => {
  const { data, isLoading, error } = useAssetDetails(
    {
      id: props.id,
    },
    !!props.id
  )

  const {
    name,
    location_object,
    serial_number,
    warranty_details,
    asset_type,
    vendor_name,
    support_name,
    support_email,
    support_phone,
    is_working,
    status,
  } = data || {}

  const pageURL = document.location.href

  if (isLoading) {
    return <AssetDetailsSkeleton />
  }

  if (error) {
    // Todo : notify user
    if ((error as AxiosError)?.response?.status === 404) {
      navigate('/assets')
    }
  }

  const isActive = status === 'ACTIVE'

  return (
    <section className="my-4">
      <div className="2xl:max-w-7xl mx-auto px-4">
        <div className="border border-slate-700 bg-slate-800 rounded-2xl">
          <h1 className="p-4 border-b border-slate-700 font-bold text-slate-300">
            {serial_number ? `# ${serial_number}` : 'Asset Details'}
          </h1>
          <div className="flex gap-8 justify-between p-4 flex-wrap">
            <div>
              <h1 className="text-2xl text-slate-100 font-bold">{name}</h1>
              <div className="mt-2 mb-4 flex gap-2">
                {!isActive ? (
                  <span className="border border-green-700 bg-green-800 bg-opacity-50 text-green-300 text-sm font-bold px-2 py-1 rounded-md">
                    Active
                  </span>
                ) : (
                  <span className="border border-yellow-700 bg-yellow-800 bg-opacity-50 text-yellow-300 text-sm font-bold px-2 py-1 rounded-md">
                    Transfer In Progress
                  </span>
                )}
                {is_working ? (
                  <span className="border border-green-700 bg-green-800 bg-opacity-50 text-green-300 text-sm font-bold px-2 py-1 rounded-md">
                    Working
                  </span>
                ) : (
                  <span className="border border-red-700 bg-red-800 bg-opacity-50 text-red-300 text-sm font-bold px-2 py-1 rounded-md">
                    Not Working
                  </span>
                )}
              </div>
              <LabelText label="Type" text={asset_type} />
              <div className="flex gap-4 mt-4 flex-wrap">
                <LabelText label="Location" text={location_object?.name} />
                <LabelText
                  label="Facility"
                  text={location_object?.facility.name}
                />
              </div>
            </div>
            <div>
              <div className="border-2 border-slate-700 p-4 rounded-xl bg-white">
                <QRCodeSVG value={pageURL} />
              </div>
            </div>
          </div>
        </div>
        <div className="border border-slate-700 bg-slate-800 rounded-2xl mt-4">
          <h1 className="p-4 border-b border-slate-700 font-bold text-slate-300">
            Warranty & Support
          </h1>
          <div className="p-4">
            <LabelText label="Vender Name" text={vendor_name} />
            <div className="flex gap-8 my-4 flex-wrap">
              <LabelText label="Customer Support Name" text={support_name} />
              <LabelText label="Customer Support Phone" text={support_phone} />
              <LabelText label="Customer Support Email" text={support_email} />
            </div>
            <LabelText label="Warranty Details" text={warranty_details} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AssetDetails
