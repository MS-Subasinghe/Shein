import Clothes from '../models/Clothes.js'

export const getALlClothes = async(req,res)=>{
    try{
        const clothes = await Clothes.find();
        res.json(clothes);


    }catch(error){
        res.status(500).json({error:"failed to fetch clothes"});

    }
};

//get singlie item by ID

export const getClothesByID = async(req,res)=>{

    try {
        const item = await Clothes.findById(req.params.id);
        if(!item){
    return res.status(404).json({error:"Item not found"})
        }

        res.json(item)
        
    } catch (error) {
        res.status(500).json({error:'error fetching item'})
    }
};


//add new clothes

export const addClothes = async(req,res)=>{
    try {

        const newClothes = new Clothes(req.body);
        await newClothes.save()
        res.status(201).json(newClothes)
        
    } catch (error) {
        res.status(400).json({error:"failed to add item", details:error.message})
    }
};

//update clothes details

export const updateClothes = async(req,res)=>{
    try {

        const updated = await Clothes.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!updated){
            return res.status(404).json({error:"item not found"});

        }
        res.json(updated)
        
    } catch (error) {
        res.status(400).json({error:"failed to update item"})
    }
};


//delete clothing items

export const deleteClothes = async(req,res)=>{
    try {
        const deleted = await Clothes.findByIdAndDelete(req.params.id);
        if(!deleted){
            return res.status(404).json({error:"item not found"})
        }
        res.json({message:"item deleted successFul"})
        
    } catch (error) {
        res.status(500).json({error:"failed to delete Item"})
    }
};