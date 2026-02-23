import express from "express"
import Wishlist from "../models/Wishlist.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

// ✅ Get wishlist
router.get("/", authMiddleware(["user"]), async (req,res)=>{
  try{
    const wishlist = await Wishlist.findOne({user:req.user.id})
    res.json(wishlist || {items:[]})
  }catch(err){
    res.status(500).json({message:"Failed to fetch wishlist"})
  }
})

// ✅ Save wishlist (replace items)
router.post("/add", authMiddleware(["user"]), async (req,res)=>{
  try{
    let wishlist = await Wishlist.findOne({user:req.user.id})

    if(!wishlist){
      wishlist = new Wishlist({
        user:req.user.id,
        items:[]
      })
    }

    wishlist.items = req.body.items
    await wishlist.save()

    res.json(wishlist)
  }catch(err){
    res.status(500).json({message:"Failed to update wishlist"})
  }
})

export default router