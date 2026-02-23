import express from "express"
import Cart from "../models/Cart.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

// Get cart
router.get("/", authMiddleware(["user"]), async (req,res)=>{
  try{
    const cart = await Cart.findOne({user:req.user.id})
    res.json(cart || {items:[]})
  }catch(err){
    res.status(500).json({message:"Failed to fetch cart"})
  }
})

// Add to cart
router.post("/add", authMiddleware(["user"]), async (req,res)=>{
  try{
    let cart = await Cart.findOne({user:req.user.id})

    if(!cart){
      cart = new Cart({user:req.user.id, items:[]})
    }

    cart.items = req.body.items
    await cart.save()

    res.json(cart)
  }catch(err){
    res.status(500).json({message:"Failed to update cart"})
  }
})


export default router