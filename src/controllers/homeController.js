let getHomePage = (req, res) => {                         // Hàm xử lý trang chủ, nhận request và gửi response
    // return res.send("hello world from controller");       // Gửi nội dung text về client
    return res.render('homepage.ejs')
}

module.exports = {
    getHomePage: getHomePage                              // Export hàm để dùng bên ngoài (ví dụ trong route)
}
