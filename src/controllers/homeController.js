import db from '../models/index'
import CRUDService from '../services/CRUDService'

let getHomePage = async (req, res) => {                         // Hàm xử lý trang chủ, nhận request và gửi response
    // return res.send("hello world from controller");       // Gửi nội dung text về client

    try {
         let data = await db.User.findAll()                        // ham findAll ti tat ca du lieu trong bang user
       
        return res.render('homepage.ejs', {
        data:JSON.stringify(data)             // truyen bien data ra view chuyen tu data snag chuoi strinng
    })
        
    } catch (e) {
        console.log(e)
    }
   
}

// tao controler crud 
let getCRUD = (req, res)=>{
    //return res.send('get CRUD with van tuong ')
  
    return res.render('crud.ejs');
    
}
// tao post crud 
let postCRUD = async(req, res) => {
   let message= await CRUDService.createNewUser(req.body)
   console.log(message);

     return res.send('get CRUD with van tuong ')
    
}

module.exports = {
    getHomePage: getHomePage      ,                        // Export hàm để dùng bên ngoài (ví dụ trong route)
    getCRUD: getCRUD,
    postCRUD:postCRUD,
}
