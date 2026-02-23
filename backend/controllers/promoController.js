import PromoCode from "../models/PromoCode.js"

// Create a Promo
export const createPromo = async (req,res) => {
  try{
    const promo = await PromoCode.create(req.body)
    res.status(201).json(promo)
  }catch(err){
    res.status(400).json({ message: err.message })
  }
}

// Get All Promos
export const getPromos = async (req,res) => {
  const promos = await PromoCode.find().sort({createdAt:-1})
  res.json(promos)
}

// Apply Promo
export const applyPromo = async (req,res) => {
  const { code, cartTotal } = req.body
  const promo = await PromoCode.findOne({
    code: code.toUpperCase(),
    isActive:true
  })

  if(!promo) return res.status(400).json({message:"Invalid code"})
  if(promo.expiryDate < new Date()) return res.status(400).json({message:"Expired"})
  if(promo.usageLimit && promo.usedCount >= promo.usageLimit)
      return res.status(400).json({message:"Usage limit reached"})
  if(cartTotal < promo.minCartValue)
      return res.status(400).json({message:"Minimum cart value not met"})

  let discount =
    promo.discountType === "percent"
      ? (cartTotal * promo.discountValue)/100
      : promo.discountValue

  if(promo.maxDiscount){
    discount = Math.min(discount,promo.maxDiscount)
  }

  res.json({
    discount,
    promoId: promo._id,
    code: promo.code
  })
}

export const togglePromo = async (req,res)=>{
  const promo = await PromoCode.findById(req.params.id)

  if(!promo) return res.status(404).json({message:"Promo not found"})

  promo.isActive = !promo.isActive
  await promo.save()

  res.json(promo)
}