import PromoCode from "../models/PromoCode.js"

export const createPromo = async (req,res)=>{
  const promo = await PromoCode.create(req.body)
  res.json(promo)
}

export const getPromos = async (req,res)=>{
  const promos = await PromoCode.find().sort({createdAt:-1})
  res.json(promos)
}

export const deletePromo = async (req,res)=>{
  await PromoCode.findByIdAndDelete(req.params.id)
  res.json({message:"Promo deleted"})
}

export const togglePromo = async (req,res)=>{
  const promo = await PromoCode.findById(req.params.id)
  promo.isActive = !promo.isActive
  await promo.save()
  res.json(promo)
}