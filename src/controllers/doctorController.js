import doctorService from '../services/doctorService.js';
const express = require('express');
const app = express();

app.use(express.json());                        // 👈 để nhận JSON (raw)
app.use(express.urlencoded({ extended: true })); // 👈 để nhận x-www-form-urlencoded



let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit; //vid du GET /api/top-doctor-home?limit=5

    if (!limit) limit = 10;

    try {
        let doctor = await doctorService.getTopDoctorHome(limit);
        return res.status(200).json({
            errCode: 0,
            message: 'OK',
            data: doctor
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: -1,
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
   getTopDoctorHome:getTopDoctorHome

};


// req.query.id	Lấy id từ query string trên URL (dùng trong GET, ví dụ: ...?id=1)
// req.body?.id	Lấy id từ body nếu có body (dùng trong POST, PUT,...)