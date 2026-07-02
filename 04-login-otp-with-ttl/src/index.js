import express from 'express'
import Redis from 'ioredis'

const app = express()
app.use(express.json())

const redis  = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')


function otpKey(phone){
    return `otp:${phone}`;
}

app.post('/otp', async(req,res) => {
    const {phone} = req.body
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(otpKey(phone), otp ,  'EX' , 30); //otp set for 30seconds
    res.json({message : 'OTP sent ', otp})

})

app.post('/otp/verify', async(req, res) => {
    const {phone, otp} = req.body
   const savedOtp =  await redis.get(otpKey(phone))

   if(!savedOtp){
    return res.json({
        message : "otp expired or not found..."
    })
   }

   if(savedOtp !== otp) {
    return res.json({
        message :"invalid OTP"
    })
   }

   // validate user 

   await redis.del(otpKey(phone));
   return res.json({ message :"OTP verified successfully..."})
})


app.get('/otp/:phone/ttl', async (req, res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone))
    res.json({ttl})
})

app.listen(3000, () => {
    console.log(`server is running on port 3000`)
})