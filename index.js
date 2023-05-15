const express = require('express');
const app = express();
const mongoose = require('mongoose');
const formidable = require('express-formidable');
const xlsx = require("xlsx");

app.use(express.json());
app.use(express.urlencoded({extended :  true, limit : "100mb"}));


const MongoDB = async () =>{
    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/xlsFile")
        console.log("Mongodb Connect");
    } catch (error) {
        console.log(error);
    }
}

MongoDB()

const StudentSchema = new mongoose.Schema({
    Name : String,
    Class : String,
    RollNo : Number,
},{
    timestamps :  true
});

const Student = mongoose.model("Student",StudentSchema);

app.post("/xlsFile",formidable(),async (req,res) =>{
    try {
        const {filedata} = req.files;
        let xlFile = xlsx.readFile(filedata.path)
        console.log(xlFile.Sheets);
        let sheet = xlFile.Sheets[xlFile.SheetNames[0]]
        let P_Json = xlsx.utils.sheet_to_json(sheet);

        await Student.insertMany(P_Json)
        return res.send(P_Json)

    } catch (error) {
        console.log(error);
    }
})

app.listen(8000,(err) =>{
    if(!err){
        console.log("Server Start 8000");
    }
})