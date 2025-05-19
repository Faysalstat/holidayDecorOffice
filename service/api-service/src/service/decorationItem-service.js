const DecorationItem = require("../model/decoration-items");


exports.addDecorationItem = async (req) => {
    let payload = req.body;
    try {
        let itemModel = {
            itemName: payload.itemName,
            quantity:payload.quanity || 0,
            costPrice:payload.costPrice || 0,
            quantityWasted:payload.quantityWasted || 0,
            unitType:payload.unitType || "PIECE"
        }
        let createdItem = await DecorationItem.create(itemModel);
        return createdItem;
    } catch (error) {
        throw new Error("Item Creation Failed")
    }
}

exports.updateDecorationItem = async (req)=>{
    let payload = req.body;
    try {
        let itemModel = {
            itemName: payload.itemName,
            quantity:payload.quantity || 0,
            costPrice:payload.costPrice || 0,
            quantityWasted:payload.quantityWasted || 0,
            unitType:payload.unitType || "PIECE"
        }
        await DecorationItem.update(itemModel,{where:{id:payload.id}});
        return "Success";
    } catch (error) {
        throw new Error("Item Creation Failed")
    }
}

exports.getAllItems = async(req)=>{
    try {
        let items = await DecorationItem.findAll();
        return items;
        
    } catch (error) {
        throw new Error(error.message) 
    }
}

exports.getDecorationItemById = async(req)=>{
    try {
        throw new Error("This API not implemented yet") 
    } catch (error) {
        throw new Error(error.message)   
    }
}

exports.deleteDecorationItem = async(req)=>{
    try {
        throw new Error("This API not implemented yet") 
    } catch (error) {
        throw new Error(error.message)   
    }
}