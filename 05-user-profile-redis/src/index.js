import expres from "express"
import Redis from 'ioredis'


const app = expres();

app.use(expres.json())


const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

//JSON METHOD BASIC ONE
app.post('/user/:id/json' , async (req , res) =>{

     await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body))

     res.json({savedAs:"json"})
})

app.get('/user/:id/json' , async (req,res) =>{

    const raw = await redis.get(`user:${req.params.id}:json`);

    if(!raw){
        return null;
    }

    res.json({user: raw ? JSON.parse(raw) : null})
})


//HASH METHOD



app.post('/user/:id/hash', async (req,res) =>{

    await redis.hset(`user:${req.params.id}:hash` , req.body)

    res.json({savedAs : "hash"})
})



app.get('/user/:id/hash', async (req,res) =>{


    //like hgetall so many methods are there jst explore them

    const user = await redis.hgetAll(`user:${req.params.id}:hash`);


    res.json(user ? {user} : null)
})


app.listen(3001,() =>{
    console.log("RUNNINT AT 3001")
})