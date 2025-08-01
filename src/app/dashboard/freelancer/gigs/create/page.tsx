'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const CreateGigPage = () => {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [acceptedTokens, setAcceptedTokens] = useState<string[]>(['SOL'])
  const [priceTiers, setPriceTiers] = useState([
    {
      name: 'Basic',
      description: '',
      price: '',
      token: 'SOL',
      deliveryDays: ''
    }
  ])

  const handleAddTier = () => {
    if (priceTiers.length >= 3) return
    const tierNames = ['Basic', 'Standard', 'Premium']
    setPriceTiers([
      ...priceTiers,
      {
        name: tierNames[priceTiers.length],
        description: '',
        price: '',
        token: 'SOL',
        deliveryDays: ''
      }
    ])
  }

  const handleRemoveTier = (index: number) => {
    if (priceTiers.length <= 1) return
    setPriceTiers(priceTiers.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/freelancer/gigs/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        acceptedTokens,
        priceTiers
      })
    })

    if (res.ok) {
      toast.success('Gig created!')
      router.push('/dashboard/freelancer/gigs')
    } else {
      toast.error('Failed to create gig')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Create Gig</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Accepted Tokens</label>
          <div className="flex gap-4">
            {['SOL', 'USDC'].map(token => (
              <label key={token} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={acceptedTokens.includes(token)}
                  onChange={() =>
                    setAcceptedTokens((prev) =>
                      prev.includes(token)
                        ? prev.filter((t) => t !== token)
                        : [...prev, token]
                    )
                  }
                />
                <span>{token}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Price Tiers</label>
          {priceTiers.map((tier, index) => (
            <div key={index} className="border border-gray-700 p-4 mb-4 rounded space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">{tier.name}</h3>
                {priceTiers.length > 1 && (
                  <button
                    type="button"
                    className="text-red-400"
                    onClick={() => handleRemoveTier(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div>
                <label>Description</label>
                <textarea
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                  rows={2}
                  value={tier.description}
                  onChange={(e) => {
                    const newTiers = [...priceTiers]
                    newTiers[index].description = e.target.value
                    setPriceTiers(newTiers)
                  }}
                  required
                />
              </div>

              <div className="flex gap-4">
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                    value={tier.price}
                    onChange={(e) => {
                      const newTiers = [...priceTiers]
                      newTiers[index].price = e.target.value
                      setPriceTiers(newTiers)
                    }}
                    required
                  />
                </div>
                <div>
                  <label>Token</label>
                  <select
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                    value={tier.token}
                    onChange={(e) => {
                      const newTiers = [...priceTiers]
                      newTiers[index].token = e.target.value
                      setPriceTiers(newTiers)
                    }}
                  >
                    <option value="SOL">SOL</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div>
                <div>
                  <label>Delivery Days</label>
                  <input
                    type="number"
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
                    value={tier.deliveryDays}
                    onChange={(e) => {
                      const newTiers = [...priceTiers]
                      newTiers[index].deliveryDays = e.target.value
                      setPriceTiers(newTiers)
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          {priceTiers.length < 3 && (
            <button
              type="button"
              onClick={handleAddTier}
              className="mt-2 text-blue-400 hover:underline"
            >
              + Add Tier
            </button>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Gig
        </button>
      </form>
    </div>
  )
}

export default CreateGigPage
