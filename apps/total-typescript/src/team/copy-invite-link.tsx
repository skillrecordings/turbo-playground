import React from 'react'
import {Button} from '@skillrecordings/react'
import {useCopyToClipboard} from 'react-use'
import toast from 'react-hot-toast'

const CopyInviteLink: React.FC<
  React.PropsWithChildren<{bulkCouponId: string; disabled: boolean}>
> = ({bulkCouponId, disabled}) => {
  const [_, setCopied] = useCopyToClipboard()
  const inviteLink = `${process.env.NEXT_PUBLIC_URL}?code=${bulkCouponId}`

  return (
    <>
      <label className="sr-only font-semibold" htmlFor="inviteLink">
        Invite Share Link
      </label>
      <div className="flex gap-3 pt-2">
        <input
          readOnly
          className="w-full rounded-md border border-gray-800 bg-gray-900 py-2 px-3 text-sm font-semibold text-white shadow-inner selection:bg-cyan-500 selection:text-white"
          id="inviteLink"
          onClick={(e) => {
            if (disabled) return
            e.currentTarget.select()
          }}
          value={inviteLink}
        />
        <Button
          type="button"
          onClick={() => {
            setCopied(inviteLink)
            toast.success('Copied')
          }}
          className={`flex flex-shrink-0 items-center gap-1 rounded-md bg-cyan-400/20 px-5 py-2 text-sm font-semibold text-cyan-300 transition ${
            disabled ? 'cursor-not-allowed' : 'hover:bg-cyan-400/30'
          }`}
          isDisabled={disabled}
        >
          Copy Link
        </Button>
      </div>
    </>
  )
}

export default CopyInviteLink
