import express from 'express';
import Redis from 'ioredis';


const app = express();

app.use(express.json())


const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')



function otpKey(phone) {

    return `otp:${phone}`
}



app.post('/otp', async (req, res) => {
    const { phone } = req.body;

    const otp = Math.floor(100000 + Math.random() * 90000000).toString();


    await redis.set(otpKey(phone), otp, 'EX', 300); //OTP IS VALID FOR 5 MINUTES  //
    //we can set max attempt as well

    res.json({ message: 'OTP sent', otp }) //in real app send otp



})


app.post('/otp/verify', async (req, res) => {

    const { phone, otp } = req.body;

    const savedOTP = await redis.get(otpKey(phone));

    if (!savedOTP) {

        return res.status(400).json({
            message: 'OTP EXPIRED OR NOT FOUND'
        })
    }


    if (savedOTP !== otp) {
        return res.status(400).json({ message: "INVALID OTP" })



    }

    //before deleting verify user and add entry in db


    await redis.del(otpKey(phone));


    res.json({
        message: "OTP verified successfully"
    })


})


app.get('/otp/:phone/ttl', async (req, res) => {

    const { phone } = req.params;


    const ttl = await redis.ttl(otpKey(phone));


    res.json({
        ttl
    })
})

app.listen(3000, () => {
    console.log("RUNNING AT PORT ")
})